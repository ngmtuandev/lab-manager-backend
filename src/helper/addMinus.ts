function addMinutes(time: any, minutesToAdd: any) {
  // Tách giờ và phút từ chuỗi thời gian
  let [hours, minutes] = time.split(':').map(Number);

  // Tạo đối tượng Date để dễ thao tác
  let date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minutesToAdd);

  // Lấy lại giờ và phút sau khi cộng
  let newHours = date.getHours().toString().padStart(2, '0');
  let newMinutes = date.getMinutes().toString().padStart(2, '0');

  return `${newHours}:${newMinutes}`;
}

export default addMinutes;
