function addMessage() {
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name && message) {
    const container = document.getElementById('messages-container');

    const card = document.createElement('div');
    card.className = 'message-card';
    card.innerHTML = `<strong>${name}:</strong><p>${message}</p>`;

    container.prepend(card);

    // مسح الحقول
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
  } else {
    alert("من فضلك اكتبي اسمك ورسالتك!");
  }
}
