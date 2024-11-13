function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0'); // Lấy giờ và thêm '0' nếu cần
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Lấy phút và thêm '0' nếu cần
  return `${hours}:${minutes}`;
}

export default getCurrentTime;
