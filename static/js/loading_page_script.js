const canvas = document.getElementById('network-background');
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const particleCount = 150;
        const maxDistance = 200;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.color = `rgba(0, ${Math.random() * 150 + 100}, ${Math.random() * 200 + 55}, ${Math.random() * 0.5 + 0.5})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function init() {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connect();
        }

        function connect() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,255,255, ${(1 - distance / maxDistance) * 0.5})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        init();
        animate();

        // Progress Bar Animation
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        const status = document.querySelector('.status');

        const messages = [
            "Inizializzazione sistemi...",
            "Scansione porte...",
            "Crittografia connessione...",
            "Analisi firewall avversario...",
            "Caricamento toolkit hacking...",
            "Sincronizzazione nodi botnet...",
            "Preparazione attacco DDoS...",
            "Connessione al darkweb...",
            "Raccolta intelligenza artificiale...",
            "Matchmaking in corso..."
        ];

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;

            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;

            status.textContent = messages[Math.floor(progress / 10)];

            if (progress === 100) {
                clearInterval(interval);
                status.textContent = "Connessione stabilita. Inizia il combattimento!";
                setTimeout(() => {
                    alert("Matchmaking completato! Preparati alla battaglia cyber!");
                }, 1000);
            }
        }, 200);