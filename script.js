function createNav() {
    const navHTML = `
        <nav class="museum-nav">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="index.html">SA BÀN ĐỊA ĐẠO CỦ CHI</a>
                </div>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="nav-links">
                    <a href="index.html" ${window.location.pathname.includes('index.html') ? 'class="active"' : ''}>Trang chủ</a>
                    <a href="about.html" ${window.location.pathname.includes('about.html') ? 'class="active"' : ''}>Giới thiệu</a>
                    <a href="exhibition.html" ${window.location.pathname.includes('exhibition.html') ? 'class="active"' : ''}>Phương tiện</a>
                    <a href="simulation.html" ${window.location.pathname.includes('simulation.html') ? 'class="active"' : ''}>Mô phỏng</a>
                    <a href="team.html" ${window.location.pathname.includes('team.html') ? 'class="active"' : ''}>Nhóm thực hiện</a>
                </div>
            </div>
        </nav>
    `;

    // Chèn navigation vào đầu body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
}
// Xử lý navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn sự kiện click lan ra document
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            console.log('Hamburger clicked'); // Debug
        });

        // Đóng menu khi click vào link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Đóng menu khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// Hàm đóng menu
window.closeMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.remove('active');
    hamburger.style.display = 'block';
}

// Animation cho số liệu thống kê
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const step = target / duration * 10;
        let current = 0;
        
        const updateNumber = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        
        updateNumber();
    });
}

// Khởi tạo khi DOM load xong
document.addEventListener('DOMContentLoaded', () => {
    createNav();
    initNavigation();

    // Xử lý animation số liệu thống kê
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver(
            entries => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            })
        );
        observer.observe(statsSection);
    }

    // Khởi tạo slideshow tự động
    const containers = document.querySelectorAll('.slideshow-container');
    containers.forEach((container, index) => {
        // Bắt đầu slideshow tự động
        startAutoSlide(index);

        // Dừng khi hover vào container
        container.addEventListener('mouseenter', () => {
            pauseAutoSlide(index);
        });

        // Tiếp tục khi rời chuột khỏi container
        container.addEventListener('mouseleave', () => {
            startAutoSlide(index);
        });

        // Cập nhật xử lý click cho các nút điều hướng
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');

        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.stopPropagation();
                changeSlide(-1, index);
                // Khởi động lại slideshow tự động
                startAutoSlide(index);
            };
        }

        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                changeSlide(1, index);
                // Khởi động lại slideshow tự động
                startAutoSlide(index);
            };
        }
    });
});

// Thêm keyframes animation
const fadeIn = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const style = document.createElement('style');
style.textContent = fadeIn;
document.head.appendChild(style);

let currentSlides = [0, 0]; // Theo dõi slide hiện tại cho mỗi slideshow
let slideIntervals = []; // Mảng lưu các interval

function changeSlide(direction, slideshowIndex) {
    const containers = document.querySelectorAll('.slideshow-container');
    const slides = containers[slideshowIndex].querySelectorAll('.model-image');
    
    // Ẩn slide hiện tại
    slides[currentSlides[slideshowIndex]].classList.remove('active');
    
    // Tính toán slide tiếp theo
    currentSlides[slideshowIndex] = (currentSlides[slideshowIndex] + direction + slides.length) % slides.length;
    
    // Hiển thị slide mới
    slides[currentSlides[slideshowIndex]].classList.add('active');
}

// Hàm bắt đầu slideshow tự động
function startAutoSlide(slideshowIndex) {
    // Xóa interval cũ nếu có
    if (slideIntervals[slideshowIndex]) {
        clearInterval(slideIntervals[slideshowIndex]);
    }
    
    // Tạo interval mới
    slideIntervals[slideshowIndex] = setInterval(() => {
        changeSlide(1, slideshowIndex);
    }, 3000); // Thay đổi từ 1500 thành 3000 (3 giây)
}

// Hàm dừng slideshow
function pauseAutoSlide(slideshowIndex) {
    if (slideIntervals[slideshowIndex]) {
        clearInterval(slideIntervals[slideshowIndex]);
    }
}

