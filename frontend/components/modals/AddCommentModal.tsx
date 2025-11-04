interface AddCommentModalProps {
    mostrar: boolean,
    fechar: () => void,
}

export default function AddCommentModal({mostrar, fechar}: AddCommentModalProps) {
    
    
    if (!mostrar) return null

    return(
        <h1>TESTE</h1>
    );
}