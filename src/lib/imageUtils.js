// 사진을 그대로 base64로 저장하면 휴대폰 카메라 원본(수 MB)이 localStorage 용량(보통 5~10MB)을
// 순식간에 초과시켜 저장 자체가 실패할 수 있다. 캔버스로 축소·재압축한 뒤 저장한다.
export function resizeImageFile(file, { maxDim = 900, quality = 0.75 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('이미지를 불러오지 못했어요.'))
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
