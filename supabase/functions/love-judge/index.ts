// AI 연애 판사 Edge Function
//
// 아직 배포/연동 전 상태입니다. 배포 방법은 supabase/schema.sql 하단 주석 참고.
// 필요한 시크릿: ANTHROPIC_API_KEY (Claude API 키)
//
// 요청 바디: { postId: string, judgeStyle: string }
// 응답: community_judgments 테이블에 저장된 판결 row (JSON)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const JUDGE_PERSONAS: Record<string, string> = {
  warm: '따뜻하고 다정한 판사. 공감 어린 어조로 위로하듯 말하되, 판결의 객관성은 유지한다.',
  cold: '냉철한 판사. 감정에 휩쓸리지 않고 논리와 사실 위주로 간결하게 말한다.',
  realist: '현실주의 판사. 이상론보다 현실적으로 실행 가능한 조언을 강조한다.',
  tsundere: '츤데레 판사. 말투는 까칠하고 퉁명스럽지만 결국 다정한 결론을 내린다.',
  friend: '친구처럼 편하게 반말로 이야기하는 판사. 친근하지만 할 말은 한다.',
  lawyer: '변호사 스타일. 논리적이고 전문적인 어조로 조목조목 짚는다.',
  counselor: '심리상담사 스타일. 감정을 깊이 들여다보고 공감하며 부드럽게 조언한다.',
}

const SYSTEM_PROMPT = `당신은 커플/연애 고민 게시판의 "AI 연애 판사"입니다.
사용자가 올린 연애 고민 글을 읽고, 아래 JSON 스키마에 정확히 맞춰 판결문을 작성하세요.

원칙:
- 어느 한쪽 편만 들지 않는다. 양측의 입장을 균형 있게 다룬다.
- 사실(글에 명시된 내용)과 추측(글에서 유추한 내용)을 구분한다.
- 감정을 존중하고, 공격적이거나 단정적인 표현은 쓰지 않는다.
- 현실적으로 실행 가능한 조언을 제공한다.
- 이것은 법률 상담이 아니라 AI의 참고 의견임을 판결문 톤에서 은연중에 드러낸다.
- 반드시 아래 JSON 스키마와 동일한 키를 가진 JSON 객체 "하나만" 출력한다. 다른 설명 텍스트를 덧붙이지 않는다.

JSON 스키마:
{
  "summary": "사건을 3~5줄로 요약한 문자열",
  "author_view": { "emotion": "", "intent": "", "pros": "", "cons": "" },
  "opponent_view": { "emotion": "", "intent": "", "possibility": "", "misunderstanding": "" },
  "issues": ["핵심 쟁점 문자열", "..."],
  "evidence": { "positive": ["..."], "negative": ["..."], "guesses": ["..."], "facts": ["..."] },
  "verdict": "판결 본문 문자열 (2~4문장)",
  "fault_author": 0,
  "fault_opponent": 0,
  "recommended_actions": [{ "action": "", "reason": "" }],
  "one_liner": "판결 한 줄 요약",
  "confidence": 0
}

fault_author + fault_opponent 는 반드시 100이 되어야 합니다. confidence는 0~100 사이의 정수입니다.`

Deno.serve(async (req) => {
  try {
    const { postId, judgeStyle } = await req.json()
    if (!postId) return new Response(JSON.stringify({ error: 'postId가 필요해요.' }), { status: 400 })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!supabaseUrl || !serviceKey || !anthropicKey) {
      return new Response(JSON.stringify({ error: 'AI 판결 기능이 아직 설정되지 않았어요.' }), { status: 501 })
    }

    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', postId)
      .maybeSingle()
    if (postError || !post) {
      return new Response(JSON.stringify({ error: '게시글을 찾을 수 없어요.' }), { status: 404 })
    }

    const persona = JUDGE_PERSONAS[judgeStyle] || JUDGE_PERSONAS.warm

    const userPrompt = `판사 페르소나: ${persona}

[카테고리] ${post.category}
[제목] ${post.title}
[상황 설명] ${post.body}
[상대방 입장] ${post.opponent_view || '(작성자가 별도로 적지 않음)'}
[작성자가 궁금해하는 점] ${post.question || '(별도로 적지 않음)'}

위 내용을 바탕으로 JSON 판결문을 작성하세요.`

    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!aiResponse.ok) {
      const text = await aiResponse.text()
      return new Response(JSON.stringify({ error: 'AI 판결 생성에 실패했어요.', detail: text }), { status: 502 })
    }

    const aiJson = await aiResponse.json()
    const rawText = aiJson.content?.[0]?.text || '{}'
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const verdict = JSON.parse(cleaned)

    const year = new Date().getFullYear()
    const caseNumber = `LOVE-${year}-${String(Math.floor(Math.random() * 900000) + 100000)}`

    const { data: saved, error: saveError } = await supabase
      .from('community_judgments')
      .upsert(
        {
          post_id: postId,
          case_number: caseNumber,
          judge_style: judgeStyle,
          summary: verdict.summary,
          author_view: verdict.author_view,
          opponent_view: verdict.opponent_view,
          issues: verdict.issues,
          evidence: verdict.evidence,
          verdict: verdict.verdict,
          fault_author: verdict.fault_author,
          fault_opponent: verdict.fault_opponent,
          recommended_actions: verdict.recommended_actions,
          one_liner: verdict.one_liner,
          confidence: verdict.confidence,
        },
        { onConflict: 'post_id' },
      )
      .select()
      .single()

    if (saveError) {
      return new Response(JSON.stringify({ error: '판결 저장에 실패했어요.', detail: saveError.message }), { status: 500 })
    }

    return new Response(JSON.stringify(saved), { status: 200, headers: { 'content-type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
