import { Link } from 'react-router-dom';
import { siteContent } from '../../data/content';
import { navigation } from '../../data/navigation';
import { MotionPreference } from '../../motion/MotionPolicy';

export function Footer() {
  return <footer className="site-footer">
    <div className="container-editorial">
      <div className="footer-main">
        <div className="footer-signature"><Link to="/" translate="no">{siteContent.brand}</Link><p>{siteContent.tagline}</p><span>Ica y Majes, Perú</span></div>
        <nav className="footer-navigation" aria-label="Navegación del pie"><p>La bodega</p>{navigation.map(item => <Link key={item.to} to={item.to}>{item.label}</Link>)}</nav>
        <div className="footer-preferences"><p>Tu experiencia</p><MotionPreference /></div>
      </div>
      <div className="footer-colophon"><p>{siteContent.footerNote}</p><Link to="/contacto#privacidad">Privacidad</Link></div>
    </div>
  </footer>;
}
