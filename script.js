document.addEventListener('DOMContentLoaded', function() {
    // Определяем, является ли устройство мобильным
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Добавляем класс для мобильных устройств
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    // Управление прелоадером
    const preloader = document.getElementById('preloader');
    
    // Функция для скрытия прелоадера
    function hidePreloader() {
        preloader.classList.add('hidden');
        
        // Удаляем прелоадер из DOM после анимации
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 500); // Задержка соответствует длительности анимации исчезновения прелоадера
        
        // Инициализируем анимации после загрузки
        initializeAnimations();
    }
    
    // Скрываем прелоадер после полной загрузки страницы 
    // (или через заданное время для лучшего UX, если загрузка быстрая)
    window.addEventListener('load', function() {
        // Задержка для более плавного UX (позволяет увидеть анимацию)
        setTimeout(hidePreloader, 800);
    });
    
    // Скрываем прелоадер через 3 секунды, даже если страница ещё не загружена
    // (для случаев, когда загрузка ресурсов затягивается)
    setTimeout(hidePreloader, 3000);
    
    // Инициализация анимаций
    function initializeAnimations() {
        // Добавляем эффект свечения, следующий за курсором
        const body = document.querySelector('body');
        const cursorGlow = document.createElement('div');
        cursorGlow.classList.add('cursor-glow');
        body.appendChild(cursorGlow);
        
        // На мобильных устройствах привязываем эффект свечения к касанию
        if (isMobile) {
            document.addEventListener('touchmove', function(e) {
                const touch = e.touches[0];
                cursorGlow.style.opacity = '0.4'; // Меньше заметен на мобильных
                cursorGlow.style.left = touch.clientX + 'px';
                cursorGlow.style.top = touch.clientY + 'px';
                
                // Скрываем через небольшую задержку для лучшего UX
                setTimeout(() => {
                    cursorGlow.style.opacity = '0';
                }, 1500);
            });
        } else {
            document.addEventListener('mousemove', function(e) {
                cursorGlow.style.opacity = '0.6';
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
            
            document.addEventListener('mouseleave', function() {
                cursorGlow.style.opacity = '0';
            });
        }
        
        // Добавляем класс .handwriting к элементам с рукописным шрифтом
        const handwritingElements = document.querySelectorAll('.love-card h1, .bunny-facts h2, .wish-card h2, .love-text p:first-child, .love-text .signature');
        handwritingElements.forEach(el => {
            el.classList.add('handwriting');
        });
        
        // Музыкальный плеер - ОБНОВЛЕННАЯ ВЕРСИЯ
        const audioElement = document.getElementById('love-song');
        const playPauseButton = document.getElementById('play-pause');
        const progressBar = document.getElementById('progress-bar');
        const progressThumb = document.getElementById('progress-thumb');
        const progressTrack = document.querySelector('.progress-track');
        const currentTimeElement = document.getElementById('current-time');
        const durationElement = document.getElementById('duration');
        
        let isPlaying = false;
        let savedVolume = 0.7;
        
        // Инициализация плеера
        function initPlayer() {
            audioElement.volume = savedVolume;
            
            // Загрузка метаданных
            audioElement.addEventListener('loadedmetadata', function() {
                updateDuration();
            });
            
            // Обновление времени
            audioElement.addEventListener('timeupdate', function() {
                updateProgress();
                updateCurrentTime();
            });
            
            // Конец трека
            audioElement.addEventListener('ended', function() {
                resetPlayer();
            });
        }
        
        // Функция воспроизведения/паузы
        function togglePlay() {
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        }
        
        function playAudio() {
            audioElement.play().then(() => {
                isPlaying = true;
                playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
                
                // Анимация звуковых волн
                const waves = document.querySelectorAll('.sound-waves .wave');
                waves.forEach(wave => {
                    wave.style.animationPlayState = 'running';
                });
                
                // Создание сердечек
                createFloatingHearts();
                
            }).catch(error => {
                console.log('Ошибка воспроизведения: ', error);
                if (isMobile) {
                    alert('Для воспроизведения музыки коснитесь кнопки ещё раз.');
                }
            });
        }
        
        function pauseAudio() {
            audioElement.pause();
            isPlaying = false;
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            
            // Остановка анимации волн
            const waves = document.querySelectorAll('.sound-waves .wave');
            waves.forEach(wave => {
                wave.style.animationPlayState = 'paused';
            });
        }
        
        function resetPlayer() {
            audioElement.currentTime = 0;
            isPlaying = false;
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            updateProgress();
            updateCurrentTime();
        }
        
        // Обновление прогресса
        function updateProgress() {
            if (audioElement.duration) {
                const progress = (audioElement.currentTime / audioElement.duration) * 100;
                progressBar.style.width = progress + '%';
                progressThumb.style.left = progress + '%';
            }
        }
        
        function updateCurrentTime() {
            if (currentTimeElement) {
                currentTimeElement.textContent = formatTime(audioElement.currentTime);
            }
        }
        
        function updateDuration() {
            if (durationElement) {
                durationElement.textContent = formatTime(audioElement.duration);
            }
        }
        
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        
        // Клик по прогресс-бару
        function handleProgressClick(e) {
            const rect = progressTrack.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            
            if (audioElement.duration) {
                audioElement.currentTime = progress * audioElement.duration;
            }
        }
        
        function createFloatingHearts() {
            const heartsContainer = document.querySelector('.floating-hearts');
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Создаем от 3 до 5 сердечек, для мобильных меньше
            const heartCount = isMobile ? 
                (Math.floor(Math.random() * 2) + 2) : // 2-3 для мобильных
                (Math.floor(Math.random() * 3) + 3);  // 3-5 для десктопов
            
            for (let i = 0; i < heartCount; i++) {
                const size = Math.floor(Math.random() * 20) + 15; // От 15px до 35px
                const heart = document.createElement('i');
                
                heart.classList.add('fas', 'fa-heart', 'floating-heart');
                heart.style.left = Math.random() * (viewportWidth - 20) + 'px';
                heart.style.bottom = '-20px';
                heart.style.fontSize = size + 'px';
                heart.style.animationDuration = (Math.random() * 5 + 8) + 's'; // От 8 до 13 секунд
                
                // Добавляем небольшую задержку для каждого сердечка
                heart.style.animationDelay = (Math.random() * 2) + 's';
                
                // Добавляем случайный оттенок розового/красного
                const hue = Math.floor(Math.random() * 30) + 340; // От 340 до 370 (или 0-10) по цветовому кругу
                const saturation = Math.floor(Math.random() * 30) + 70; // От 70% до 100%
                const lightness = Math.floor(Math.random() * 20) + 50; // От 50% до 70%
                heart.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                
                heartsContainer.appendChild(heart);
                
                // Удаляем сердечко после окончания анимации
                setTimeout(() => {
                    if (heart && heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 15000);
            }
        }
        
        // Привязка событий
        playPauseButton.addEventListener('click', togglePlay);
        progressTrack.addEventListener('click', handleProgressClick);
        
        // Инициализация
        initPlayer();
        
        // Анимация появления элементов
        function animateElements() {
            // Реализовано через CSS-анимации в классах animate-fadein и animate-slideup
            
            // Анимация постепенного появления текста
            const textElements = document.querySelectorAll('.love-text p');
            textElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100 + index * 200);
            });
        }
        
        // Запускаем анимацию с небольшой задержкой после загрузки страницы
        setTimeout(animateElements, 500);
        
        // Создаем сердечки при клике на зайчика
        const bunnyHead = document.getElementById('bunny-head');
        const bunnyPhoto = document.getElementById('bunny-photo');
        
        // Выбираем событие в зависимости от типа устройства
        const eventType = isMobile ? 'touchstart' : 'click';
        
        bunnyHead.addEventListener(eventType, createHeartBurst);
        bunnyPhoto.addEventListener(eventType, createHeartBurst);
        
        function createHeartBurst(event) {
            // Определяем координаты клика/касания
            let clickX, clickY;
            
            if (isMobile && event.touches) {
                const touch = event.touches[0];
                clickX = touch.clientX;
                clickY = touch.clientY;
            } else {
                clickX = event.clientX;
                clickY = event.clientY;
            }
            
            // Создаем меньше сердечек на мобильных для экономии ресурсов
            const heartCount = isMobile ? 
                (Math.floor(Math.random() * 3) + 3) : // 3-5 для мобильных
                (Math.floor(Math.random() * 5) + 5);  // 5-9 для десктопов
            
            for (let i = 0; i < heartCount; i++) {
                const heart = document.createElement('i');
                heart.classList.add('fas', 'fa-heart', 'heart-burst');
                heart.style.left = clickX + 'px';
                heart.style.top = clickY + 'px';
                
                // Размер сердечка
                const size = Math.floor(Math.random() * 18) + 15; // От 15px до 33px
                heart.style.fontSize = size + 'px';
                
                // Случайный угол и расстояние от центра
                const angle = Math.random() * Math.PI * 2; // От 0 до 2π
                const distance = Math.random() * 60 + 30; // От 30px до 90px от центра
                const offsetX = Math.cos(angle) * distance;
                const offsetY = Math.sin(angle) * distance;
                
                // Трансформируем элемент для эффекта разлета
                heart.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                
                // Цвет сердечка с более яркими и разнообразными оттенками
                const hue = Math.floor(Math.random() * 40) + 330; // От 330 до 370 по цветовому кругу
                heart.style.color = `hsl(${hue}, 100%, ${60 + Math.random() * 15}%)`;
                
                // Анимация появления с разной длительностью
                heart.style.animationDuration = (Math.random() * 0.7 + 1) + 's';
                
                document.body.appendChild(heart);
                
                // Удаляем сердечко после окончания анимации
                setTimeout(() => {
                    if (heart && heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 1500);
            }
        }
        
        // Добавляем интерактивность для элементов списка (facts)
        const factItems = document.querySelectorAll('.bunny-facts li');
        factItems.forEach(item => {
            // На мобильных используем событие касания
            if (isMobile) {
                item.addEventListener('touchstart', function() {
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'scale(1.3) rotate(5deg)';
                        
                        setTimeout(() => {
                            icon.style.transform = 'scale(1)';
                        }, 500);
                    }
                });
            } else {
                item.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'scale(1.3) rotate(5deg)';
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'scale(1)';
                    }
                });
            }
        });
        
        // Генерация плавающих сердечек
        generateFloatingHearts();
        // На мобильных устройствах генерируем сердечки реже для экономии ресурсов
        setInterval(generateFloatingHearts, isMobile ? 8000 : 4000);
    }
}); 