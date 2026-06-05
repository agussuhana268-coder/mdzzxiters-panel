async function uploadAvatar() {
  const fileInput = document.getElementById("avatarInput")
  const file = fileInput.files[0]

  if (!file) {
    alert("Pilih gambar dulu!")
    return
  }

  const adminId = 1
  const filePath = `admins/${adminId}.png`

  // UPLOAD
  const { error: uploadError } = await supabaseClient.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true
    })

  if (uploadError) {
    console.log(uploadError)
    alert("Upload gagal!")
    return
  }

  // GET URL
  const { data } = supabaseClient.storage
    .from("avatars")
    .getPublicUrl(filePath)

  const publicUrl = data.publicUrl

  // SAVE DB
  const { error: dbError } = await supabaseClient
    .from("admins")
    .update({ avatar_url: publicUrl })
    .eq("id", adminId)

  if (dbError) {
    console.log(dbError)
    alert("Gagal simpan ke database!")
    return
  }

  // SHOW IMAGE
  document.getElementById("previewAvatar").src = publicUrl

  alert("Upload berhasil!")
}
