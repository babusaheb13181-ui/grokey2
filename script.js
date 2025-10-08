// Global Variables
let currentChatUser = null;
let cartItems = [];
let currentPopup = null;
let currentOverlay = null;

// Chat data storage
const chatData = {
    sarah: {
        name: 'Sarah M.',
        avatar: '👤',
        status: 'Online',
        book: 'The Great Gatsby - $12.99',
        messages: [
            { id: 1, text: 'Hi! I saw your listing for The Great Gatsby. Is it still available?', sender: 'me', time: '10:30 AM', status: 'read' },
            { id: 2, text: 'Yes, it\'s still available! The book is in good condition with minimal wear.', sender: 'them', time: '10:32 AM' },
            { id: 3, text: 'Great! Can you send me some photos of the book?', sender: 'me', time: '10:35 AM', status: 'read' },
            { id: 4, text: 'Sure! Let me take some photos and send them to you.', sender: 'them', time: '10:37 AM' },
            { id: 5, text: 'Is the book still available? Can we meet tomorrow?', sender: 'them', time: '2 min ago' }
        ]
    },
    mike: {
        name: 'Mike R.',
        avatar: '👤',
        status: 'Last seen 30 min ago',
        book: 'Python Programming - $45.00',
        messages: [
            { id: 1, text: 'Hello! I\'m interested in your Python Programming book.', sender: 'me', time: '9:15 AM', status: 'read' },
            { id: 2, text: 'Thanks for your interest! Yes, it\'s available.', sender: 'them', time: '9:20 AM' },
            { id: 3, text: 'What\'s the condition of the book?', sender: 'me', time: '9:22 AM', status: 'read' },
            { id: 4, text: 'It\'s like new! I barely used it during my course.', sender: 'them', time: '9:25 AM' },
            { id: 5, text: 'Perfect! When can we meet?', sender: 'me', time: '9:30 AM', status: 'delivered' }
        ]
    },
    emma: {
        name: 'Emma L.',
        avatar: '👤',
        status: 'Online',
        book: 'Calculus: Early Transcendentals - $85.00',
        messages: [
            { id: 1, text: 'Hi! I need this calculus book for my course.', sender: 'me', time: '8:45 AM', status: 'read' },
            { id: 2, text: 'Great! It\'s a really good textbook. Are you a student?', sender: 'them', time: '8:50 AM' },
            { id: 3, text: 'Yes, I\'m starting calculus next semester.', sender: 'me', time: '8:52 AM', status: 'read' },
            { id: 4, text: 'Hi! Can you send more photos of the book?', sender: 'them', time: '3 hours ago' }
        ]
    }
};

// Book details data
const bookDetails = {
    gatsby: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: '$12.99',
        condition: 'Good',
        seller: 'Sarah M.',
        location: 'New York, NY'
    },
    python: {
        title: 'Python Programming',
        author: 'John Smith',
        price: '$45.00',
        condition: 'Like New',
        seller: 'Mike R.',
        location: 'Boston, MA'
    },
    calculus: {
        title: 'Calculus: Early Transcendentals',
        author: 'James Stewart',
        price: '$85.00',
        condition: 'Good',
        seller: 'Emma L.',
        location: 'Chicago, IL'
    },
    marketing: {
        title: 'Marketing Management',
        author: 'Philip Kotler',
        price: '$65.00',
        condition: 'Fair',
        seller: 'Alex K.',
        location: 'Los Angeles, CA'
    },
    physics: {
        title: 'University Physics',
        author: 'Young & Freedman',
        price: '$120.00',
        condition: 'New',
        seller: 'David P.',
        location: 'Seattle, WA'
    }
};

// Tab Management Functions
function showTab(tabName) {
    // Hide all tab contents
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update navigation buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate the corresponding nav button
    const activeBtn = Array.from(navBtns).find(btn => 
        btn.onclick && btn.onclick.toString().includes(tabName)
    );
    if (activeBtn && tabName !== 'sell') {
        activeBtn.classList.add('active');
    }
}

// Form Handling Functions
function handleSellBook(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const bookData = Object.fromEntries(formData);
    
    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.category || !bookData.condition || !bookData.price) {
        alert('❌ Please fill in all required fields!');
        return;
    }
    
    // Show success message
    showNotification('🎉 Your book has been listed successfully! It will be reviewed and published within 24 hours.', 'success');
    
    // Reset form
    event.target.reset();
    
    // Switch to My Books tab
    showTab('mybooks');
}

function handleUpdateProfile(event) {
    event.preventDefault();
    
    // Show success message
    showNotification('✅ Profile updated successfully!', 'success');
}

function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        showNotification('👋 You have been logged out successfully!', 'info');
        // In a real app, this would redirect to login page
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

// Navigation Functions
function showChat() {
    showTab('chat');
}

function showCart() {
    showTab('cart');
}

// Chat Functions
function chatWithSeller(bookId) {
    const sellerMap = {
        'gatsby': 'sarah',
        'python': 'mike',
        'calculus': 'emma',
        'marketing': 'alex',
        'physics': 'david'
    };
    
    showTab('chat');
    setTimeout(() => {
        openChat(sellerMap[bookId] || 'sarah');
    }, 100);
}

function openChat(userId) {
    currentChatUser = userId;
    const user = chatData[userId];
    
    if (!user) {
        console.error('User not found:', userId);
        return;
    }

    // Update chat header
    const chatUserName = document.getElementById('chatUserName');
    const chatUserStatus = document.getElementById('chatUserStatus');
    const chatUserAvatar = document.getElementById('chatUserAvatar');
    
    if (chatUserName) chatUserName.textContent = user.name;
    if (chatUserStatus) chatUserStatus.textContent = user.status;
    if (chatUserAvatar) chatUserAvatar.textContent = user.avatar;

    // Show chat window, hide chat list
    const chatList = document.getElementById('chatList');
    const chatWindow = document.getElementById('chatWindow');
    
    if (chatList) chatList.style.display = 'none';
    if (chatWindow) {
        chatWindow.classList.remove('hidden');
        chatWindow.style.display = 'block';
    }

    // Load messages
    loadChatMessages(user.messages);
}

function closeChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    const chatList = document.getElementById('chatList');
    
    if (chatWindow) {
        chatWindow.classList.add('hidden');
        chatWindow.style.display = 'none';
    }
    if (chatList) {
        chatList.style.display = 'block';
    }
    
    currentChatUser = null;
}

function loadChatMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} mb-3 chat-message`;

        const messageContent = `
            <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'me' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200'
            }">
                <p class="text-sm">${escapeHtml(message.text)}</p>
                <div class="flex items-center justify-between mt-1">
                    <span class="text-xs opacity-70">${message.time}</span>
                    ${message.sender === 'me' ? `
                        <span class="text-xs ml-2">
                            ${getMessageStatusIcon(message.status)}
                        </span>
                    ` : ''}
                </div>
            </div>
        `;

        messageDiv.innerHTML = messageContent;
        chatMessages.appendChild(messageDiv);
    });

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getMessageStatusIcon(status) {
    switch(status) {
        case 'sent': return '✓';
        case 'delivered': return '✓✓';
        case 'read': return '<span style="color: #4ade80;">✓✓</span>';
        default: return '⏱️';
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    const messageText = messageInput.value.trim();

    if (!messageText || !currentChatUser) return;

    const user = chatData[currentChatUser];
    if (!user) return;
    
    const newMessage = {
        id: user.messages.length + 1,
        text: messageText,
        sender: 'me',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'sent'
    };

    // Add message to chat data
    user.messages.push(newMessage);

    // Clear input
    messageInput.value = '';

    // Reload messages
    loadChatMessages(user.messages);

    // Simulate message status updates
    setTimeout(() => {
        newMessage.status = 'delivered';
        loadChatMessages(user.messages);
    }, 1000);

    setTimeout(() => {
        newMessage.status = 'read';
        loadChatMessages(user.messages);
    }, 3000);

    // Simulate auto-reply
    setTimeout(() => {
        const autoReply = {
            id: user.messages.length + 1,
            text: getAutoReply(messageText),
            sender: 'them',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        user.messages.push(autoReply);
        loadChatMessages(user.messages);
    }, 5000);
}

function getAutoReply(messageText) {
    const replies = [
        "Thanks for your message! I'll get back to you soon.",
        "Sure, let me check and get back to you.",
        "That sounds good to me!",
        "I'm available to meet this week.",
        "Let me know what works best for you.",
        "I'll send you more details shortly.",
        "Perfect! Looking forward to hearing from you."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}

function handleMessageKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

// Book Details Functions
function showBookDetails(bookId) {
    const book = bookDetails[bookId] || bookDetails.gatsby;
    
    const detailsText = `📖 ${book.title} by ${book.author}
💰 Price: ${book.price}
📍 Location: ${book.location}
👤 Seller: ${book.seller}
📋 Condition: ${book.condition}

Click "Chat" to contact the seller!`;
    
    alert(detailsText);
}

// Cart Management Functions
function updateCartQuantity(button, change) {
    const quantitySpan = button.parentElement.querySelector('.cart-quantity');
    if (!quantitySpan) return;
    
    const currentQty = parseInt(quantitySpan.textContent);
    const newQty = Math.max(1, currentQty + change);
    quantitySpan.textContent = newQty;
    
    // Update cart totals
    updateCartTotals();
}

function removeFromCart(button) {
    if (confirm('Remove this item from cart?')) {
        const cartItem = button.closest('.bg-white');
        if (cartItem) {
            cartItem.remove();
            updateCartTotals();
            showNotification('Item removed from cart!', 'info');
        }
    }
}

function updateCartTotals() {
    const cartItems = document.querySelectorAll('#cartItems .bg-white');
    let totalItems = 0;
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const quantityElement = item.querySelector('.cart-quantity');
        const priceElement = item.querySelector('.text-green-600');
        
        if (quantityElement && priceElement) {
            const quantity = parseInt(quantityElement.textContent);
            const priceText = priceElement.textContent;
            const price = parseFloat(priceText.replace('₹', '').replace(',', ''));
            
            totalItems += quantity;
            subtotal += price * quantity;
        }
    });
    
    const shipping = 499;
    const grandTotal = subtotal + shipping;
    
    // Update display elements
    const totalItemsElement = document.getElementById('totalItems');
    const subtotalElement = document.getElementById('subtotal');
    const grandTotalElement = document.getElementById('grandTotal');
    const totalInRupeesElement = document.getElementById('totalInRupees');
    const cartBadgeElement = document.getElementById('cartBadge');
    
    if (totalItemsElement) totalItemsElement.textContent = totalItems;
    if (subtotalElement) subtotalElement.textContent = '₹' + subtotal.toLocaleString();
    if (grandTotalElement) grandTotalElement.textContent = '₹' + grandTotal.toLocaleString();
    if (totalInRupeesElement) totalInRupeesElement.textContent = grandTotal.toLocaleString();
    if (cartBadgeElement) cartBadgeElement.textContent = totalItems;
}

function clearCart() {
    const cartItemsElement = document.getElementById('cartItems');
    if (cartItemsElement) {
        cartItemsElement.innerHTML = '<div class="text-center py-8 text-gray-500"><p class="text-lg mb-2">🛒</p><p>Your cart is empty</p></div>';
    }
    
    // Reset all totals
    const elements = {
        'cartBadge': '0',
        'totalItems': '0',
        'subtotal': '₹0',
        'grandTotal': '₹499',
        'totalInRupees': '499'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Add to Cart Functions
function addToCartWithQuantity(button) {
    const bookCard = button.closest('.book-card');
    if (!bookCard) return;
    
    const bookTitleElement = bookCard.querySelector('h4');
    if (!bookTitleElement) return;
    
    const bookTitle = bookTitleElement.textContent;
    
    // Check if quantity controls exist
    const quantitySpan = button.parentElement.querySelector('span');
    const quantity = quantitySpan ? parseInt(quantitySpan.textContent) : 1;
    
    // Show success popup
    showSuccessPopup(bookTitle, quantity);
    
    // Update cart badge
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + quantity;
    }
    
    // Reset quantity to 1 after adding to cart
    if (quantitySpan) {
        quantitySpan.textContent = '1';
    }
}

function showSuccessPopup(bookTitle, quantity) {
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl border-2 border-green-200 p-6 z-50 max-w-sm mx-4';
    popup.style.animation = 'popupSlideIn 0.3s ease-out';
    
    popup.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">✅</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Successfully Added!</h3>
            <p class="text-gray-600 mb-1"><strong>"${escapeHtml(bookTitle)}"</strong></p>
            <p class="text-sm text-gray-500 mb-4">Quantity: <span class="font-semibold text-green-600">${quantity}</span></p>
            <div class="flex space-x-3">
                <button onclick="closePopup()" class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                    Continue Shopping
                </button>
                <button onclick="closePopup(); showCart();" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    View Cart 🛒
                </button>
            </div>
        </div>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
    overlay.onclick = closePopup;
    
    // Add to page
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Store references for cleanup
    currentPopup = popup;
    currentOverlay = overlay;
    
    // Auto close after 3 seconds
    setTimeout(closePopup, 3000);
}

function closePopup() {
    if (currentPopup && currentOverlay) {
        currentPopup.style.animation = 'popupSlideOut 0.3s ease-in';
        setTimeout(() => {
            if (currentPopup && currentOverlay) {
                document.body.removeChild(currentPopup);
                document.body.removeChild(currentOverlay);
                currentPopup = null;
                currentOverlay = null;
            }
        }, 300);
    }
}

// Payment Functions
function proceedWithPhonePe() {
    const totalInRupeesElement = document.getElementById('totalInRupees');
    if (!totalInRupeesElement) return;
    
    const totalInRupees = totalInRupeesElement.textContent;
    const upiId = '8709754019@ybl';
    const merchantName = 'BookMarket';
    const transactionNote = 'BookMarket Purchase';
    
    // Remove commas from amount for UPI URL
    const amount = totalInRupees.replace(',', '');
    
    // Create UPI payment URLs
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    const phonepeUrl = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    // Show confirmation before redirecting
    const confirmMessage = `💳 Confirm Payment

Amount: ₹${totalInRupees}
To: ${merchantName}
UPI ID: ${upiId}

You will be redirected to PhonePe app to complete the payment.`;
    
    if (confirm(confirmMessage)) {
        // Try to open PhonePe app first, then fallback to generic UPI
        const tryPhonePe = () => {
            window.open(phonepeUrl, '_blank');
            
            // Fallback to generic UPI after a short delay
            setTimeout(() => {
                window.open(upiUrl, '_blank');
            }, 1000);
        };
        
        // For mobile devices, try direct app opening
        if (isMobileDevice()) {
            tryPhonePe();
        } else {
            // For desktop, show QR code option or manual UPI ID
            const desktopMessage = `📱 Mobile Payment Required

To complete the payment:
1. Open PhonePe app on your mobile
2. Scan QR code or enter UPI ID: ${upiId}
3. Enter amount: ₹${totalInRupees}

Click OK to copy UPI ID to clipboard, or Cancel to try mobile redirect.`;
            
            const desktopPayment = confirm(desktopMessage);
            
            if (desktopPayment) {
                // Copy UPI ID to clipboard
                copyToClipboard(upiId).then(() => {
                    alert(`✅ UPI ID copied to clipboard!

${upiId}

Amount: ₹${totalInRupees}

Open PhonePe app and paste the UPI ID to make payment.`);
                }).catch(() => {
                    alert(`📋 UPI ID: ${upiId}
Amount: ₹${totalInRupees}

Please copy this UPI ID and use it in PhonePe app to make payment.`);
                });
            } else {
                tryPhonePe();
            }
        }
        
        // Show instructions
        setTimeout(() => {
            const instructionsMessage = `📱 Payment Instructions:

1. Complete payment in PhonePe app
2. Return to this page after payment
3. Your order will be confirmed

Amount: ₹${totalInRupees}
UPI ID: ${upiId}`;
            
            alert(instructionsMessage);
        }, 2000);
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                resolve();
            } catch (err) {
                document.body.removeChild(textArea);
                reject(err);
            }
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const colors = {
        success: 'border-l-4 border-green-500 bg-green-50 text-green-800',
        error: 'border-l-4 border-red-500 bg-red-50 text-red-800',
        warning: 'border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800',
        info: 'border-l-4 border-blue-500 bg-blue-50 text-blue-800'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="flex-1">${escapeHtml(message)}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-500 hover:text-gray-700">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('input[placeholder*="Search books"]');
    if (searchInput) {
        const debouncedSearch = debounce(performSearch, 300);
        searchInput.addEventListener('input', debouncedSearch);
    }
}

function performSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const author = card.querySelector('.text-gray-600')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || author.includes(query) || query === '') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    showTab('home');
    
    // Initialize search
    initializeSearch();
    
    // Add event listeners for dynamic content
    document.addEventListener('click', function(e) {
        // Handle Add to Cart buttons
        if (e.target.textContent === 'Add to Cart' && !e.target.onclick) {
            e.preventDefault();
            const bookCard = e.target.closest('.book-card');
            if (bookCard) {
                const bookTitle = bookCard.querySelector('h4')?.textContent || 'Unknown Book';
                showNotification(`📚 "${bookTitle}" has been added to your cart!`, 'success');
                
                // Update cart badge
                const cartBadge = document.getElementById('cartBadge');
                if (cartBadge) {
                    const currentCount = parseInt(cartBadge.textContent) || 0;
                    cartBadge.textContent = currentCount + 1;
                }
            }
        }
        
        // Handle quantity controls
        if (e.target.textContent === '+') {
            const quantitySpan = e.target.previousElementSibling;
            if (quantitySpan && quantitySpan.classList.contains('cart-quantity')) {
                const currentQty = parseInt(quantitySpan.textContent);
                quantitySpan.textContent = currentQty + 1;
                updateCartTotals();
            } else if (quantitySpan) {
                const currentQty = parseInt(quantitySpan.textContent);
                quantitySpan.textContent = currentQty + 1;
            }
        } else if (e.target.textContent === '-') {
            const quantitySpan = e.target.nextElementSibling;
            if (quantitySpan && quantitySpan.classList.contains('cart-quantity')) {
                const currentQty = parseInt(quantitySpan.textContent);
                if (currentQty > 1) {
                    quantitySpan.textContent = currentQty - 1;
                    updateCartTotals();
                }
            } else if (quantitySpan) {
                const currentQty = parseInt(quantitySpan.textContent);
                if (currentQty > 1) {
                    quantitySpan.textContent = currentQty - 1;
                }
            }
        } else if (e.target.textContent === '🗑️') {
            if (confirm('Remove this item from cart?')) {
                const cartItem = e.target.closest('.bg-white');
                if (cartItem) {
                    cartItem.remove();
                    updateCartTotals();
                    showNotification('Item removed from cart!', 'info');
                }
            }
        }
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Search books"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close popups
        if (e.key === 'Escape') {
            closePopup();
            if (currentChatUser) {
                closeChatWindow();
            }
        }
    });
});

// Export functions for global access (if needed)
window.BookMarketApp = {
    showTab,
    showChat,
    showCart,
    chatWithSeller,
    openChat,
    closeChatWindow,
    sendMessage,
    handleSellBook,
    handleUpdateProfile,
    handleLogout,
    showBookDetails,
    addToCartWithQuantity,
    updateCartQuantity,
    removeFromCart,
    proceedWithPhonePe,
    clearCart,
    showNotification
};