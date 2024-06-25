import { AxiosError } from "axios";

export const ToastErrorTemplate = (method: string, error: AxiosError) => {
  const message = error.response ? error.response.data : error.message;

  return (
    <div>
      {method !== "" && <b>{method}:</b>} {JSON.stringify(message)}
    </div>
  );
};
