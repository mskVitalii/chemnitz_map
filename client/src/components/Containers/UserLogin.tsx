import { ReactNode } from "react";
import logo from "@assets/logo.svg";

interface IUserLayout {
  children: ReactNode;
  title?: string;
}

function UserLogin({ children, title }: IUserLayout) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-100">
      <div className="flex flex-col mb-2 items-center justify-center">
        <div className="flex flex-row items-center space-x-4 max-w-fit min-w-[180px] mb-6">
          <img className="h-8" src={logo} alt="Chemnitz maps" />
          <p className="text-gray-800 font-medium text-nowrap">Chemnitz maps</p>
        </div>
        {title && (
          <header className="pb-4">
            <div className="">
              <h1 className="text-3xl font-bold tracking-tight text-black">
                {title}
              </h1>
            </div>
          </header>
        )}
        <div className="min-w-full md:min-w-[468px]">{children}</div>
      </div>
    </div>
  );
}

export default UserLogin;
