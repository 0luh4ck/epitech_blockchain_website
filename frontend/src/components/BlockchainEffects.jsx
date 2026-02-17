import React, { useEffect, useRef } from 'react';

const BlockchainEffects = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Configuration
    const particles = [];
    const connections = [];
    const particleCount = 50;
    const connectionDistance = 100;

    // Classe Particle
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02;

        // Rebond sur les bords
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Garder dans les limites
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity + Math.sin(this.pulse) * 0.2;
        ctx.fillStyle = '#10B981'; // Vert blockchain
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Classe Connection
    class Connection {
      constructor(particle1, particle2) {
        this.particle1 = particle1;
        this.particle2 = particle2;
        this.distance = Math.sqrt(
          Math.pow(particle1.x - particle2.x, 2) + 
          Math.pow(particle1.y - particle2.y, 2)
        );
        this.opacity = Math.max(0, 1 - this.distance / connectionDistance);
      }

      draw() {
        if (this.distance < connectionDistance) {
          ctx.save();
          ctx.globalAlpha = this.opacity * 0.3;
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.particle1.x, this.particle1.y);
          ctx.lineTo(this.particle2.x, this.particle2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Initialiser les particules
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Fonction d'animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mettre à jour et dessiner les particules
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Créer les connexions
      connections.length = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const connection = new Connection(particles[i], particles[j]);
          connections.push(connection);
        }
      }

      // Dessiner les connexions
      connections.forEach(connection => connection.draw());

      animationId = requestAnimationFrame(animate);
    };

    // Redimensionner le canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default BlockchainEffects;
