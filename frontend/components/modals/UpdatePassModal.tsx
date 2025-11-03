interface EditUserPassProps {
    mostrar: boolean;
    voltar: () => void;
}

export default function EditUserPass({mostrar,voltar}: EditUserPassProps) {
    if (!mostrar) return null;

    return(
        <h1>teste</h1>
    );
}