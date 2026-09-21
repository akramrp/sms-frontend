export const Footer = () => {
    return (
        <footer className="app-footer app-footer-modern">
            <div className="footer-brand">
                <span className="footer-brand-icon" aria-hidden="true"><i className="bi bi-mortarboard-fill" /></span>
                <span>
                    <strong>Online SMS</strong>
                    <small>Smart school management</small>
                </span>
            </div>
            <div className="footer-copy">
                <span>Copyright &copy; 2026</span>
                <span className="footer-divider" aria-hidden="true">&bull;</span>
                <span>All rights reserved.</span>
            </div>
            <div className="footer-status">
                <span className="footer-status-dot" aria-hidden="true" />
                <span>Complete school management system</span>
            </div>
        </footer>
    );
};