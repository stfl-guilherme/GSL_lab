import { useNavigate } from 'react-router'

// Devolve a função "voltar para a home, direto nas pastas".
// O state viaja junto com a navegação; a Home lê location.state.scrollTo
// ao montar e rola até essa seção.
// É um hook (e não uma função solta) porque useNavigate só funciona
// dentro de componentes/hooks.
export function useVoltarAoInicio() {
  const navigate = useNavigate()
  return () => navigate('/', { state: { scrollTo: 'trabalhos' } })
}
