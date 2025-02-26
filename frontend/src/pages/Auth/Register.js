import "./Auth.css";
import {Link} from 'react-router-dom';
import { useState, useEffect } from "react";

const Register = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div id="register">
            <h2>SnapFlow</h2>
            <p className="subtitle">Junte-se a nós e compartilhe momentos incríveis!</p>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome"/>
                <input type="email" placeholder="E-mail"/>
                <input type="password" placeholder="Senha"/>
                <input type="password" placeholder="Confirme sua senha"/>
                <input type="submit" value="Cadastrar"/>
            </form>
            <p>
                Já tem conta? <Link to="/login">Clique Aqui</Link>
            </p>
        </div>
    )
}

export default Register;