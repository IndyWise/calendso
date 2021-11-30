import { signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { useState } from "react";

import { useLocale } from "@lib/hooks/useLocale";
import prisma from "@lib/prisma";

import { HeadSeo } from "@components/seo/head-seo";
import { UsernameInput } from "@components/ui/UsernameInput";
import ErrorAlert from "@components/ui/alerts/Error";

export default function Signup(props) {
  const { t } = useLocale();
  const router = useRouter();

  const [hasErrors, setHasErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleErrors = async (resp) => {
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message);
    }
  };

  const signUp = (e) => {
    e.preventDefault();

    if (e.target.password.value !== e.target.passwordcheck.value) {
      throw new Error("Password mismatch");
    }

    const email: string = e.target.email.value;
    const password: string = e.target.password.value;

    fetch("/api/auth/signup", {
      body: JSON.stringify({
        username: e.target.username.value,
        password,
        email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(handleErrors)
      .then(() => signIn("Cal.com", { callbackUrl: (router.query.callbackUrl || "") as string }))
      .catch((err) => {
        setHasErrors(true);
        setErrorMessage(err.message);
      });
  };

  return (
    <div
      className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <HeadSeo title={t("sign_up")} description={t("sign_up")} />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 font-cal">
          {t("create_your_account")}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 mx-2 bg-white shadow sm:rounded-lg sm:px-10">
          <form method="POST" onSubmit={signUp} className="space-y-6 bg-white">
            {hasErrors && <ErrorAlert message={errorMessage} />}
            <div>
              <div className="mb-2">
                <UsernameInput required />
              </div>
              <div className="mb-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t("email")}
                </label>
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  id="email"
                  placeholder="jdoe@example.com"
                  disabled={!!props.email}
                  readOnly={!!props.email}
                  value={props.email}
                  className="block w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-brand sm:text-sm"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t("password")}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  placeholder="•••••••••••••"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-brand sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="passwordcheck" className="block text-sm font-medium text-gray-700">
                  {t("confirm_password")}
                </label>
                <input
                  type="password"
                  name="passwordcheck"
                  id="passwordcheck"
                  required
                  placeholder="•••••••••••••"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-brand sm:text-sm"
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  if (!ctx.query.token) {
    return {
      notFound: true,
    };
  }
  const verificationRequest = await prisma.verificationRequest.findUnique({
    where: {
      token: ctx.query.token,
    },
  });

  // for now, disable if no verificationRequestToken given or token expired
  if (!verificationRequest || verificationRequest.expires < new Date()) {
    return {
      notFound: true,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      AND: [
        {
          email: verificationRequest.identifier,
        },
        {
          emailVerified: {
            not: null,
          },
        },
      ],
    },
  });

  if (existingUser) {
    return {
      redirect: { permanent: false, destination: "/auth/login?callbackUrl=" + ctx.query.callbackUrl },
    };
  }

  return { props: { email: verificationRequest.identifier } };
}
