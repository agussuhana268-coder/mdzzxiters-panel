// avatar-upload.js

async function uploadAvatar() {
  const fileInput = document.getElementById("avatarInput")
  const file = fileInput.files[0]

  if (!file) {
    alert("Pilih gambar dulu!")
    return
  }

  const adminId = 1 // nanti bisa diganti session login

  const filePath = `admins/${adminId}.png`

  // 1. UPLOAD KE SUPABASE STORAGE
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true
    })

  if (uploadError) {
    console.log(uploadError)
    alert("Upload gagal!")
    return
  }

  // 2. AMBIL PUBLIC URL
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  const publicUrl = data.publicUrl

  // 3. SIMPAN KE DATABASE (admins)
  const { error: dbError } = await supabase
    .from("admins")
    .update({ avatar_url: publicUrl })
    .eq("id", adminId)

  if (dbError) {
    console.log(dbError)
    alert("Gagal simpan ke database!")
    return
  }

  // 4. TAMPILKAN DI UI
  document.getElementById("previewAvatar").src = publicUrl

  alert("Upload berhasil!")
}
