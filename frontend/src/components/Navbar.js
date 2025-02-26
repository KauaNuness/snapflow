import { BsHouseDoor, BsHouseDoorFill, BsSearch, BsFillPersonFill, BsFillCameraFill } from "react-icons/bs";
import "./Navbar.css";

import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav id="nav">
            <Link to="/">SnapFlow</Link>
            <form id="search-form">
                <BsSearch />
                <input type="text" placeholder="Pesquisar"/>
            </form>
            <ul id="nav-links">
                <li>
                <NavLink to="/">
                    <BsHouseDoorFill />
                </NavLink>
                </li>
                <li>
                <NavLink to="/login">
                    Entrar
                </NavLink>
                </li>
                <li>
                <NavLink to="/register">
                    Cadastrar
                </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
