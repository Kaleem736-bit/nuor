// بيانات التطبيق
let friends = {};
let currentFriend = null;
let darkMode = false;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  loadFriends();
  setupThemeButton();
  setupScrollButton();
});

// تحميل الأصدقاء من localStorage
function loadFriends() {
  const savedData = localStorage.getItem('nourMessagesApp');
  if (savedData) {
    friends = JSON.parse(savedData);
    renderFriendsList();
  }
}

// عرض قائمة الأصدقاء
function renderFriendsList() {
  const friendsList = document.getElementById('friends-list');
  friendsList.innerHTML = '';
  
  Object.keys(friends).forEach(friendName => {
    const friendCard = document.createElement('div');
    friendCard.className = 'friend-card';
    if (currentFriend === friendName) {
      friendCard.classList.add('selected');
    }
    
    // إنشاء رمز الصديقة
    const icon = document.createElement('i');
    icon.className = 'fas fa-user';
    
    // إنشاء اسم الصديقة
    const nameSpan = document.createElement('span');
    nameSpan.textContent = friendName;
    
    // إنشاء عدد الرسائل إذا وجدت
    if (friends[friendName].messages && friends[friendName].messages.length > 0) {
      const msgCount = document.createElement('span');
      msgCount.className = 'msg-count';
      msgCount.textContent = friends[friendName].messages.length;
      friendCard.appendChild(msgCount);
    }
    
    friendCard.appendChild(icon);
    friendCard.appendChild(nameSpan);
    friendCard.onclick = () => selectFriend(friendName);
    friendsList.appendChild(friendCard);
  });
}

// اختيار صديقة
function selectFriend(friendName) {
  currentFriend = friendName;
  
  // إظهار قسم الرسائل وإخفاء قسم الأصدقاء
  document.querySelector('.friend-section').style.display = 'none';
  document.getElementById('message-section').style.display = 'block';
  
  // تحديث العنوان
  document.getElementById('selected-friend-name').textContent = friendName;
  
  // عرض الرسائل
  renderMessages();
  
  // التمرير للأعلى
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// إلغاء اختيار صديقة
function deselectFriend() {
  currentFriend = null;
  
  // إظهار قسم الأصدقاء وإخفاء قسم الرسائل
  document.querySelector('.friend-section').style.display = 'block';
  document.getElementById('message-section').style.display = 'none';
  
  // إعادة عرض قائمة الأصدقاء
  renderFriendsList();
}

// عرض الرسائل للصديقة المحددة
function renderMessages() {
  const container = document.getElementById('messages-container');
  container.innerHTML = '';
  
  if (friends[currentFriend] && friends[currentFriend].messages) {
    friends[currentFriend].messages.forEach((msg, index) => {
      const card = document.createElement('div');
      card.className = 'message-card';
      
      // إنشاء محتوى الرسالة
      const content = document.createElement('p');
      content.className = 'message-content';
      content.textContent = msg.text;
      
      // إنشاء وقت الرسالة
      const time = document.createElement('div');
      time.className = 'message-time';
      time.textContent = msg.time;
      
      // إضافة العناصر للبطاقة
      card.appendChild(content);
      card.appendChild(time);
      
      container.appendChild(card);
    });
  } else {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'لا توجد رسائل بعد. اكتبي أول رسالة!';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.padding = '20px';
    emptyMsg.style.opacity = '0.7';
    container.appendChild(emptyMsg);
  }
}

// إضافة رسالة جديدة
function addMessage() {
  const messageText = document.getElementById('message').value.trim();
  
  if (messageText && currentFriend) {
    if (!friends[currentFriend]) {
      friends[currentFriend] = { messages: [] };
    }
    
    const newMessage = {
      text: messageText,
      time: new Date().toLocaleString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    friends[currentFriend].messages.unshift(newMessage);
    saveData();
    
    // مسح حقل الرسالة
    document.getElementById('message').value = '';
    
    // إعادة عرض الرسائل
    renderMessages();
    
    // إظهار تأثير للرسالة الجديدة
    if (document.querySelector('.message-card')) {
      document.querySelector('.message-card').style.animation = 'fadeIn 0.5s ease';
    }
  } else {
    showAlert('من فضلك اكتبي رسالة أولاً!', 'error');
  }
}

// إظهار نموذج إضافة صديقة جديدة
function showAddFriendForm() {
  document.getElementById('add-friend-form').style.display = 'block';
  document.getElementById('new-friend-name').focus();
}

// إخفاء نموذج إضافة صديقة جديدة
function hideAddFriendForm() {
  document.getElementById('add-friend-form').style.display = 'none';
  document.getElementById('new-friend-name').value = '';
}

// إضافة صديقة جديدة
function addNewFriend() {
  const friendName = document.getElementById('new-friend-name').value.trim();
  
  if (friendName) {
    if (!friends[friendName]) {
      friends[friendName] = { messages: [] };
      saveData();
      renderFriendsList();
      hideAddFriendForm();
      showAlert(`تمت إضافة ${friendName} بنجاح!`, 'success');
    } else {
      showAlert('هذه الصديقة موجودة بالفعل!', 'error');
    }
  } else {
    showAlert('من فضلك أدخلي اسم الصديقة!', 'error');
  }
}

// حفظ البيانات في localStorage
function saveData() {
  localStorage.setItem('nourMessagesApp', JSON.stringify(friends));
}

// إعداد زر تغيير الثيم
function setupThemeButton() {
  const themeBtn = document.getElementById('theme-btn');
  themeBtn.addEventListener('click', toggleTheme);
  
  // تحميل وضع الثيم من localStorage
  const savedTheme = localStorage.getItem('nourMessagesTheme');
  if (savedTheme === 'dark') {
    darkMode = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// تبديل وضع الثيم
function toggleTheme() {
  darkMode = !darkMode;
  
  if (darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('theme-btn').innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('nourMessagesTheme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('theme-btn').innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('nourMessagesTheme', 'light');
  }
}

// إعداد زر التمرير للأعلى
function setupScrollButton() {
  const scrollBtn = document.getElementById('scroll-top-btn');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
}

// التمرير للأعلى
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// عرض رسالة تنبيه
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.style.opacity = '1';
  }, 10);
  
  setTimeout(() => {
    alert.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(alert);
    }, 300);
  }, 3000);
}

// إضافة أنيميشن للرسائل الجديدة
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .alert-success {
    background-color: #00b894;
  }
  
  .alert-error {
    background-color: #d63031;
  }
  
  .msg-count {
    position: absolute;
    top: -5px;
    left: -5px;
    background-color: var(--dark-color);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7em;
    font-weight: bold;
  }
`;
document.head.appendChild(style);
