import { Link } from "react-router-dom";

function NotFound() {
    return (
        <main className="not-found">
            <p>404</p>
            <h1>Page not found</h1>
            <Link to="/">RETURN HOME</Link>
        </main>
    );
}

export default NotFound;