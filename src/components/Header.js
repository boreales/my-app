import logo from '../logo.svg';

function Header() {
    return (
        <header className="App-header">
            <h1>Code Snippet Manager</h1>
            <img src={logo} className='App-logo' alt='logo' />
        </header>
    );
}

export default Header;
