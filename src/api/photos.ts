const API_BASE = '/api/v1/photos'

export async function fetchPhotos() {
  const res = await fetch(API_BASE)
  if (!res.ok) throw new Error('Failed to fetch photos')
  return res.json()
}

export async function uploadPhoto(formData: FormData) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Failed to upload photo')
  return res.json()
}

export async function updatePhoto(id: number, data: Record<string, any>) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update photo')
  return res.json()
}

export async function deletePhoto(id: number) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete photo')
  return res.json()
}
