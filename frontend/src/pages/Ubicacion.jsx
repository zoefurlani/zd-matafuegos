import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Ubicacion = () => {
  const { colors } = useTheme();

  return (
    <>
      <Navbar />
      <div style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        paddingTop: '80px'
      }}>
        <main style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '48px 32px' 
        }} className="ubicacion-container">
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: colors.text,
            transition: 'color 0.3s ease'
          }} className="ubicacion-title">
            Nuestra Ubicación
          </h1>
          <p style={{
            fontSize: '20px',
            color: colors.textSecondary,
            marginBottom: '48px',
            transition: 'color 0.3s ease'
          }} className="ubicacion-subtitle">
            Encuéntranos y contáctanos
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }} className="contact-cards-grid">
            <div style={{
              backgroundColor: colors.cardBg,
              padding: '32px',
              borderRadius: '12px',
              boxShadow: colors.shadow,
              border: '2px solid ' + colors.border,
              transition: 'all 0.3s ease'
            }} className="contact-card">
              <MapPin size={32} color="#ef4444" style={{ marginBottom: '16px' }} className="card-icon" />
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: colors.text,
                transition: 'color 0.3s ease'
              }} className="card-title">
                Dirección
              </h3>
              <p style={{ 
                color: colors.textSecondary, 
                transition: 'color 0.3s ease',
                lineHeight: '1.6'
              }} className="card-text">
                Av. Ejemplo N°0000<br />
                Ciudad, Provincia<br />
                Argentina
              </p>
            </div>

            <div style={{
              backgroundColor: colors.cardBg,
              padding: '32px',
              borderRadius: '12px',
              boxShadow: colors.shadow,
              border: '2px solid ' + colors.border,
              transition: 'all 0.3s ease'
            }} className="contact-card">
              <Phone size={32} color="#ef4444" style={{ marginBottom: '16px' }} className="card-icon" />
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: colors.text,
                transition: 'color 0.3s ease'
              }} className="card-title">
                Teléfono
              </h3>
              <p style={{ 
                color: colors.textSecondary, 
                transition: 'color 0.3s ease',
                lineHeight: '1.6'
              }} className="card-text">
                +54 9 0000 00-0000<br />
                WhatsApp disponible
              </p>
            </div>

            <div style={{
              backgroundColor: colors.cardBg,
              padding: '32px',
              borderRadius: '12px',
              boxShadow: colors.shadow,
              border: '2px solid ' + colors.border,
              transition: 'all 0.3s ease'
            }} className="contact-card">
              <Mail size={32} color="#ef4444" style={{ marginBottom: '16px' }} className="card-icon" />
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: colors.text,
                transition: 'color 0.3s ease'
              }} className="card-title">
                Email
              </h3>
              <p style={{ 
                color: colors.textSecondary, 
                transition: 'color 0.3s ease',
                lineHeight: '1.6'
              }} className="card-text">
                contacto@ejemplo.com
              </p>
            </div>

            <div style={{
              backgroundColor: colors.cardBg,
              padding: '32px',
              borderRadius: '12px',
              boxShadow: colors.shadow,
              border: '2px solid ' + colors.border,
              transition: 'all 0.3s ease'
            }} className="contact-card">
              <Clock size={32} color="#ef4444" style={{ marginBottom: '16px' }} className="card-icon" />
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: colors.text,
                transition: 'color 0.3s ease'
              }} className="card-title">
                Horarios
              </h3>
              <p style={{ 
                color: colors.textSecondary, 
                transition: 'color 0.3s ease',
                lineHeight: '1.6'
              }} className="card-text">
                Lunes a Sábado<br />
                9:00 - 13:00 | 16:00 - 20:00<br />
                Domingo: Cerrado
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: colors.cardBg,
            padding: '24px',
            borderRadius: '12px',
            boxShadow: colors.shadow,
            border: '2px solid ' + colors.border,
            transition: 'all 0.3s ease'
          }} className="map-container">
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: colors.text,
              transition: 'color 0.3s ease'
            }} className="map-title">
              Cómo llegar
            </h2>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '8px'
            }} className="map-wrapper">
              <iframe
                src="https://www.google.com/maps?q=Buenos+Aires,+Argentina&output=embed"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación ZD Matafuegos - Ciudad, Provincia"
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />

      <style>{`
        /* Tablet */
        @media (max-width: 768px) {
          .ubicacion-container {
            padding: 32px 24px !important;
          }

          .ubicacion-title {
            font-size: 36px !important;
          }

          .ubicacion-subtitle {
            font-size: 18px !important;
            margin-bottom: 32px !important;
          }

          .contact-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            margin-bottom: 32px !important;
          }

          .contact-card {
            padding: 24px !important;
          }

          .card-icon {
            width: 28px !important;
            height: 28px !important;
          }

          .card-title {
            font-size: 18px !important;
          }

          .card-text {
            font-size: 15px !important;
          }

          .map-container {
            padding: 20px !important;
          }

          .map-title {
            font-size: 20px !important;
            margin-bottom: 20px !important;
          }

          .map-wrapper {
            padding-bottom: 75% !important;
          }
        }

        /* Mobile pequeño */
        @media (max-width: 480px) {
          .ubicacion-container {
            padding: 24px 16px !important;
          }

          .ubicacion-title {
            font-size: 28px !important;
          }

          .ubicacion-subtitle {
            font-size: 16px !important;
            margin-bottom: 24px !important;
          }

          .contact-cards-grid {
            gap: 16px !important;
            margin-bottom: 24px !important;
          }

          .contact-card {
            padding: 20px !important;
          }

          .card-icon {
            width: 24px !important;
            height: 24px !important;
            margin-bottom: 12px !important;
          }

          .card-title {
            font-size: 16px !important;
            margin-bottom: 6px !important;
          }

          .card-text {
            font-size: 14px !important;
          }

          .map-container {
            padding: 16px !important;
          }

          .map-title {
            font-size: 18px !important;
            margin-bottom: 16px !important;
          }

          .map-wrapper {
            padding-bottom: 100% !important;
          }
        }

        /* Hover effects para cards */
        .contact-card:hover {
          transform: translateY(-4px);
          border-color: #ef4444;
        }
      `}</style>
    </>
  );
};

export default Ubicacion;