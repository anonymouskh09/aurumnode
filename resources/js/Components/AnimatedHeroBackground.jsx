import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 52;
const SYMBOL_COUNT = 10;
const CONNECT_DISTANCE = 130;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

export default function AnimatedHeroBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return undefined;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return undefined;
        }

        let width = 0;
        let height = 0;
        let rafId = 0;

        const particles = [];
        const symbols = [];
        const symbolPool = ['$', '%', 'EUR', 'USD', 'BTC', 'AI'];

        const resize = () => {
            const bounds = canvas.getBoundingClientRect();
            width = Math.max(1, Math.floor(bounds.width));
            height = Math.max(1, Math.floor(bounds.height));

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const seedObjects = () => {
            particles.length = 0;
            symbols.length = 0;

            for (let i = 0; i < PARTICLE_COUNT; i += 1) {
                particles.push({
                    x: rand(0, width),
                    y: rand(0, height),
                    vx: rand(-0.22, 0.22),
                    vy: rand(-0.2, 0.2),
                    r: rand(0.8, 2.1),
                });
            }

            for (let i = 0; i < SYMBOL_COUNT; i += 1) {
                symbols.push({
                    text: symbolPool[Math.floor(rand(0, symbolPool.length))],
                    x: rand(0, width),
                    y: rand(0, height),
                    vx: rand(-0.08, 0.08),
                    vy: rand(-0.06, 0.06),
                    size: rand(12, 19),
                    alpha: rand(0.08, 0.22),
                });
            }
        };

        const drawBackground = () => {
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, '#1a1c28');
            grad.addColorStop(1, '#151724');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        };

        const update = () => {
            drawBackground();

            const mouse = mouseRef.current;

            for (const particle of particles) {
                if (mouse.active) {
                    const dx = mouse.x - particle.x;
                    const dy = mouse.y - particle.y;
                    const dist2 = dx * dx + dy * dy;
                    const influence = 150 * 150;

                    if (dist2 < influence) {
                        const force = (1 - dist2 / influence) * 0.013;
                        particle.vx += dx * force * 0.005;
                        particle.vy += dy * force * 0.005;
                    }
                }

                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.988;
                particle.vy *= 0.988;

                if (particle.x < -5) particle.x = width + 5;
                if (particle.x > width + 5) particle.x = -5;
                if (particle.y < -5) particle.y = height + 5;
                if (particle.y > height + 5) particle.y = -5;
            }

            for (let i = 0; i < particles.length; i += 1) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j += 1) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < CONNECT_DISTANCE) {
                        const alpha = (1 - dist / CONNECT_DISTANCE) * 0.22;
                        ctx.strokeStyle = `rgba(212,166,58,${alpha.toFixed(3)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            for (const particle of particles) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(242,208,107,0.7)';
                ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
                ctx.fill();
            }

            for (const symbol of symbols) {
                symbol.x += symbol.vx;
                symbol.y += symbol.vy;

                if (symbol.x < -30) symbol.x = width + 20;
                if (symbol.x > width + 30) symbol.x = -20;
                if (symbol.y < -20) symbol.y = height + 20;
                if (symbol.y > height + 20) symbol.y = -20;

                ctx.fillStyle = `rgba(242,208,107,${symbol.alpha.toFixed(3)})`;
                ctx.font = `${symbol.size}px Inter, Arial, sans-serif`;
                ctx.fillText(symbol.text, symbol.x, symbol.y);
            }

            const vignette = ctx.createRadialGradient(
                width * 0.5,
                height * 0.38,
                width * 0.08,
                width * 0.5,
                height * 0.55,
                width * 0.9,
            );
            vignette.addColorStop(0, 'rgba(0,0,0,0.0)');
            vignette.addColorStop(1, 'rgba(0,0,0,0.38)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, width, height);

            rafId = window.requestAnimationFrame(update);
        };

        const onMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = event.clientX - rect.left;
            mouseRef.current.y = event.clientY - rect.top;
            mouseRef.current.active = true;
        };

        const onMouseLeave = () => {
            mouseRef.current.active = false;
        };

        resize();
        seedObjects();
        update();

        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
        />
    );
}
