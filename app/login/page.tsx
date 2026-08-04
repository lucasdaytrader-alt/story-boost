"use client";

import { useActionState, useState } from "react";
import { signInAction, signUpAction, type AuthActionState } from "./actions";
import { Button } from "@/components/ui/Button";
import { BrandStripe } from "@/components/ui/BrandStripe";

export default function LoginPage() {
  const [mode, setMode] = useState<"entrar" | "cadastrar">("entrar");

  const [signInState, signInFormAction, signInPending] = useActionState<AuthActionState, FormData>(
    signInAction,
    null
  );
  const [signUpState, signUpFormAction, signUpPending] = useActionState<AuthActionState, FormData>(
    signUpAction,
    null
  );

  const state = mode === "entrar" ? signInState : signUpState;
  const pending = mode === "entrar" ? signInPending : signUpPending;

  return (
    <div className="hero-wash relative mx-auto flex min-h-screen max-w-md flex-col justify-center bg-paper px-6 py-10">
      <BrandStripe className="absolute inset-x-0 top-0" />
      <div className="mb-7 text-center">
        <span className="shadow-glow-brand mx-auto mb-3 grid h-14 w-14 place-items-center rounded-xl brand-gradient text-xl font-bold text-white">
          SB
        </span>
        <h1 className="font-display text-[26px] font-extrabold tracking-tight text-ink">Story Boost</h1>
        <p className="mt-1.5 text-sm text-muted">
          Milhares de elementos para seus Stories, em segundos.
        </p>
      </div>

      <div className="shadow-elevation-2 rounded-3xl border border-line bg-white p-5">
        <div className="mb-5 flex rounded-2xl bg-mist p-1">
          <button
            onClick={() => setMode("entrar")}
            className={`transition-premium flex-1 rounded-xl py-2 text-sm font-semibold ${
              mode === "entrar" ? "shadow-elevation-1 bg-white text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("cadastrar")}
            className={`transition-premium flex-1 rounded-xl py-2 text-sm font-semibold ${
              mode === "cadastrar" ? "shadow-elevation-1 bg-white text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Criar conta
          </button>
        </div>

        {mode === "entrar" ? (
          <form action={signInFormAction} className="flex flex-col gap-3">
            <Input name="email" type="email" placeholder="E-mail" required />
            <Input name="password" type="password" placeholder="Senha" required />
            {state?.error && <ErrorMessage>{state.error}</ErrorMessage>}
            <Button type="submit" loading={pending} size="lg" className="mt-1">
              {pending ? "Aguarde..." : "Entrar"}
            </Button>
          </form>
        ) : (
          <form action={signUpFormAction} className="flex flex-col gap-3">
            <Input name="name" type="text" placeholder="Seu nome" required />
            <Input name="email" type="email" placeholder="E-mail" required />
            <Input name="password" type="password" placeholder="Senha (mín. 6 caracteres)" required minLength={6} />
            {state?.error && <ErrorMessage>{state.error}</ErrorMessage>}
            <Button type="submit" loading={pending} size="lg" className="mt-1">
              {pending ? "Aguarde..." : "Criar conta"}
            </Button>
          </form>
        )}

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs text-muted">ou continue com</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline" size="lg" disabled>
            Continuar com Google
          </Button>
          <Button type="button" variant="outline" size="lg" disabled>
            Continuar com Apple
          </Button>
          <p className="text-center text-[11px] text-muted">
            Login social chega assim que as credenciais Google/Apple forem configuradas em produção.
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted">
        Conta de teste: ana@teste.com · senha ana123456
      </p>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="focus-ring transition-premium rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:ring-2 focus:ring-flame/40"
    />
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-flame/20 bg-flame/10 px-3 py-2 text-[13px] font-medium text-flame">
      {children}
    </p>
  );
}
