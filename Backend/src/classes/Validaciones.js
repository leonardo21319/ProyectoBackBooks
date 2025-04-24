class Validaciones{
    
    static  validarEmail(email) {
        const regex = /^[^\s@]+@alumno\.ipn\.mx$/i;
        return regex.test(email);
    }
}