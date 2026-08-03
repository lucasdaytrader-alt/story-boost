/**
 * Boost Engine — Serviço de usuários
 *
 * getCurrentUser() agora resolve a sessão real (Sprint de Autenticação),
 * substituindo o stub temporário das sprints anteriores. Mantido neste
 * arquivo por compatibilidade com o restante do código.
 */

export { requireUser as getCurrentUser } from "./auth";
