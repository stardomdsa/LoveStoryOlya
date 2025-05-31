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
        const volumeButton = document.getElementById('volume-btn');
        const progressBar = document.getElementById('progress-bar');
        const progressThumb = document.getElementById('progress-thumb');
        const progressTrack = document.querySelector('.progress-track');
        const currentTimeElement = document.getElementById('current-time');
        const durationElement = document.getElementById('duration');
        
        let isPlaying = false;
        let isMuted = false;
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
        
        // Управление громкостью
        function toggleVolume() {
            if (isMuted) {
                audioElement.volume = savedVolume;
                volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
                isMuted = false;
            } else {
                savedVolume = audioElement.volume;
                audioElement.volume = 0;
                volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
                isMuted = true;
            }
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
            if (!heartsContainer) return;
            
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const heart = document.createElement('i');
                    heart.classList.add('fas', 'fa-heart', 'floating-heart');
                    heart.style.left = Math.random() * window.innerWidth + 'px';
                    heart.style.bottom = '-20px';
                    heart.style.fontSize = (15 + Math.random() * 10) + 'px';
                    heart.style.color = `hsl(${340 + Math.random() * 20}, 85%, 65%)`;
                    heartsContainer.appendChild(heart);
                    
                    setTimeout(() => {
                        if (heart.parentNode) heart.parentNode.removeChild(heart);
                    }, 8000);
                }, i * 500);
            }
        }
        
        // Привязка событий
        playPauseButton.addEventListener('click', togglePlay);
        volumeButton.addEventListener('click', toggleVolume);
        progressTrack.addEventListener('click', handleProgressClick);
        
        // Инициализация
        initPlayer();
        
        // Предварительно загружаем аудио для мобильных устройств
        if (isMobile) {
            audioElement.load();
            document.body.addEventListener('touchstart', function() {
                if (audioElement.readyState >= 2) {
                    document.body.removeEventListener('touchstart', arguments.callee);
                }
            }, { once: true });
        }
        
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
            
            // Подпрыгивание ушек при клике с более плавной анимацией
            const ears = document.querySelectorAll('.ear');
            ears.forEach(ear => {
                ear.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                ear.style.transform = ear.classList.contains('left') ? 
                    'rotate(-20deg) translateY(-20px)' : 
                    'rotate(20deg) translateY(-20px)';
                
                setTimeout(() => {
                    ear.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    ear.style.transform = ear.classList.contains('left') ? 
                        'rotate(-10deg)' : 
                        'rotate(10deg)';
                }, 400);
            });
            
            // Добавляем эффект улыбки на мордочке зайчика
            const mouth = document.querySelector('.mouth');
            if (mouth) {
                mouth.style.height = '18px';
                mouth.style.width = '40px';
                mouth.style.borderRadius = '0 0 100% 100%';
                
                setTimeout(() => {
                    mouth.style.height = '12px';
                    mouth.style.width = '36px';
                    mouth.style.borderRadius = '0 0 50% 50%';
                }, 1000);
            }
            
            // Делаем глаза более выразительными
            const eyes = document.querySelectorAll('.eye');
            eyes.forEach(eye => {
                eye.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    eye.style.transform = 'scale(1)';
                }, 500);
            });
        }
        
        // Добавляем эффект параллакса для фото при движении мыши/касаниях
        const bunnyMain = document.querySelector('.bunny-main');
        
        if (!isMobile) {
            // Параллакс на десктопе
            document.addEventListener('mousemove', function(e) {
                if (!bunnyMain) return;
                
                const mouseX = e.clientX / window.innerWidth - 0.5;
                const mouseY = e.clientY / window.innerHeight - 0.5;
                
                const photo = document.querySelector('.bunny-photo img');
                if (photo) {
                    photo.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
                }
                
                const ears = document.querySelectorAll('.ear');
                ears.forEach(ear => {
                    const direction = ear.classList.contains('left') ? -1 : 1;
                    ear.style.transform = `rotate(${direction * 10 + mouseX * direction * 5}deg) translateX(${mouseX * 5}px)`;
                });
            });
        } else {
            // Легкий эффект наклона на мобильных устройствах на основе гироскопа
            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', function(e) {
                    if (!e.beta || !e.gamma || !bunnyMain) return;
                    
                    // Наклон устройства
                    const tiltX = (e.gamma / 30); // от -1 до 1 для наклона влево-вправо
                    const tiltY = (e.beta / 30);  // от -1 до 1 для наклона вперед-назад
                    
                    const photo = document.querySelector('.bunny-photo img');
                    if (photo) {
                        photo.style.transform = `translate(${tiltX * 8}px, ${tiltY * 8}px)`;
                    }
                    
                    const ears = document.querySelectorAll('.ear');
                    ears.forEach(ear => {
                        const direction = ear.classList.contains('left') ? -1 : 1;
                        ear.style.transform = `rotate(${direction * 10 + tiltX * direction * 3}deg) translateX(${tiltX * 3}px)`;
                    });
                });
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
        
        // Добавляем интерактивные эффекты для подписи
        const signature = document.querySelector('.love-text .signature');
        if (signature) {
            // На мобильных используем событие касания
            if (isMobile) {
                signature.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(1.1) rotate(-3deg)';
                    this.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    
                    setTimeout(() => {
                        this.style.transform = 'scale(1) rotate(0)';
                    }, 500);
                });
            } else {
                signature.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1) rotate(-3deg)';
                    this.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                });
                
                signature.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) rotate(0)';
                });
            }
        }
        
        // Улучшаем эффект при наведении на кнопку музыки
        const musicButton = document.querySelector('.music-fab');
        if (musicButton) {
            if (isMobile) {
                // На мобильных делаем эффект при касании
                musicButton.addEventListener('touchstart', function() {
                    this.style.transform = 'translateX(-50%) scale(1.1)';
                    this.style.boxShadow = '0 8px 32px rgba(255, 77, 109, 0.4), 0 0 30px rgba(255, 77, 109, 0.5)';
                    
                    // Создаем маленькие нотки вокруг кнопки
                    createMusicNotes();
                    
                    setTimeout(() => {
                        this.style.transform = 'translateX(-50%)';
                        this.style.boxShadow = '0 4px 24px rgba(255, 182, 193, 0.7), 0 0 25px rgba(255, 77, 109, 0.4)';
                    }, 600);
                });
            } else {
                musicButton.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(-50%) scale(1.1)';
                    this.style.boxShadow = '0 8px 32px rgba(255, 77, 109, 0.4), 0 0 30px rgba(255, 77, 109, 0.5)';
                    
                    // Создаем маленькие нотки вокруг кнопки
                    createMusicNotes();
                });
                
                musicButton.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(-50%)';
                    this.style.boxShadow = '0 4px 24px rgba(255, 182, 193, 0.7), 0 0 25px rgba(255, 77, 109, 0.4)';
                });
            }
        }
        
        function createMusicNotes() {
            // Уменьшаем количество заметок на мобильных устройствах
            const notesCount = isMobile ? 2 : 4;
            const notes = ['♪', '♫', '♬', '♩'];
            const musicBtn = document.querySelector('.music-fab');
            if (!musicBtn) return;
            
            const btnRect = musicBtn.getBoundingClientRect();
            const centerX = btnRect.left + btnRect.width / 2;
            const centerY = btnRect.top + btnRect.height / 2;
            
            for (let i = 0; i < notesCount; i++) {
                const note = document.createElement('div');
                note.textContent = notes[Math.floor(Math.random() * notes.length)];
                note.style.position = 'fixed';
                note.style.fontSize = '20px';
                note.style.color = 'white';
                note.style.fontWeight = 'bold';
                note.style.textShadow = '0 0 5px rgba(255, 77, 109, 0.8)';
                note.style.pointerEvents = 'none';
                note.style.zIndex = '10';
                
                // Размещаем ноты вокруг кнопки
                const angle = Math.random() * Math.PI * 2;
                const distance = 40 + Math.random() * 20;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                note.style.left = x + 'px';
                note.style.top = y + 'px';
                
                // Добавляем анимацию для нот
                note.style.animation = 'floatUpNote 2s forwards';
                note.style.opacity = '0';
                
                document.body.appendChild(note);
                
                // Создаем keyframes для анимации
                const style = document.createElement('style');
                style.innerHTML = `
                    @keyframes floatUpNote {
                        0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
                        20% { opacity: 1; }
                        100% { transform: translate(${Math.random() * 40 - 20}px, -${50 + Math.random() * 30}px) scale(1); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
                
                // Удаляем ноты после анимации
                setTimeout(() => {
                    if (note.parentNode) {
                        note.parentNode.removeChild(note);
                    }
                    if (style.parentNode) {
                        style.parentNode.removeChild(style);
                    }
                }, 2000);
            }
        }
        
        // Анимируем эффект "блика" на поверхности карточек
        const cards = document.querySelectorAll('.love-card, .bunny-facts, .wish-card');
        
        // На мобильных устройствах используем гироскоп для эффекта блика
        if (isMobile && window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function(e) {
                if (!e.beta || !e.gamma) return;
                
                // Наклон устройства
                const tiltX = (e.gamma / 30); // от -1 до 1 для наклона влево-вправо
                const tiltY = (e.beta / 30);  // от -1 до 1 для наклона вперед-назад
                
                cards.forEach(card => {
                    card.style.transform = `translateY(-5px) rotate(${tiltX * 2}deg) rotateX(${-tiltY * 3}deg) rotateY(${tiltX * 3}deg)`;
                });
            });
        } else {
            // На десктопе используем движение мыши
            cards.forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const percentX = (x - centerX) / centerX;
                    const percentY = (y - centerY) / centerY;
                    
                    this.style.transform = `translateY(-8px) rotate(${-percentX * 1}deg) rotateX(${-percentY * 2}deg) rotateY(${percentX * 2}deg)`;
                    
                    // Перемещаем эффект блика
                    const glare = this.querySelector('::after') || this;
                    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, transparent 60%)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) rotate(0)';
                });
            });
        }
    }
}); 