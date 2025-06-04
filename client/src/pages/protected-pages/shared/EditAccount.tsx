import { useState, type ChangeEvent } from "react";
import InputBox from "../../../components/InputBox";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  editAccountValidation,
  type AccountType,
} from "../../../validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ACCOUNT_URL } from "../../../api/request-api";
import type { AxiosError } from "axios";
import Button from "../../../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "../../../utils/capitalize-first-letter";
import PreviewAccountProfile from "./components/accounts-page/PreviewAccountProfile";
import { useParams } from "react-router-dom";
import type { FullUserType } from "../../../types/user.types";
import BoxesLoading from "./components/loading/BoxesLoading";
import { useAuthStore } from "../../../store/auth.store";

const DEFAULT_VALUES = {
  employer_name: "",
  username: "",
  role: "cashier" as "cashier" | "admin" | "manager",
  profile_picture: null,
  passcode: "",
  password: "",
  password_confirmation: "",
};
function EditAccount() {
  const { user, setUser } = useAuthStore();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInterceptor();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<AccountType>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(editAccountValidation),
  });

  const [previewProductThumbnail, setPreviewProductThumbnail] = useState<
    string | null
  >(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const accountDetails = useQuery({
    queryKey: ["account-details", id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${ACCOUNT_URL}/account-details/${id}`
      );
      const data = response.data.data as FullUserType;

      for (const [key, value] of Object.entries(data)) {
        if (key in DEFAULT_VALUES) {
          setValue(key as keyof typeof DEFAULT_VALUES, value as string | null);
        }
      }
    },
  });
  const editAccount = useMutation({
    mutationFn: async (
      data: Omit<AccountType, "password" | "password_confirmation"> & {
        password: string | null;
        password_confirmation: string | null;
      }
    ) => {
      const response = await axiosInstance.patch(
        `${ACCOUNT_URL}/edit-account/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message, user_details }) => {
      if (user?.id == id) {
        setUser(user_details);
      }
      toast.success(message);
      reset();
      navigate("/accounts");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["user-information"] });
    },
    onError: (
      err: AxiosError<{ message: string; field: "username" | "passcode" }>
    ) => {
      console.log(err);
      if (err.response?.status === 422) {
        toast.error("Please check your input and try again.");
      } else if (err.response?.status === 409) {
        setError(err.response.data.field, {
          type: "manual",
          message: err.response.data.message,
        });
      } else {
        console.log(err);
        toast.error(err.response?.data.message);
      }
    },
  });

  const uploadProductThumbnail = useMutation({
    mutationFn: async (data: File) => {
      const thumbnail = new FormData();
      thumbnail.set("project-thumbnail", data);

      const response = await axios.post(
        `${ACCOUNT_URL}/upload-thumbnail`,
        thumbnail,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("session_token")}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (data) => {
            console.log(data);
          },
        }
      );
      return response.data;
    },
    onSuccess: ({ data }) => {
      setValue("profile_picture", data.secure_url);
    },
    onError: () => {
      setPreviewProductThumbnail(null);
    },
  });

  function handleUploadProductThumbnail(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    if (!file) return "No File attach";
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setPreviewProductThumbnail(e.target?.result);
        uploadProductThumbnail.mutate(file);
      }
    };
    reader.onerror = () => {
      toast.error("Something went wrong while uploading the file");
    };

    reader.readAsDataURL(file);
  }
  return (
    <div className="pt-3 bg-white/20 rounded-sm border border-zinc-800/15 p-2 w-full h-full relative">
      <form
        onSubmit={handleSubmit((data: AccountType) => {
          const payload = { ...data } as Omit<
            AccountType,
            "password" | "password_confirmation"
          > & {
            password: string | null;
            password_confirmation: string | null;
          };

          if (data.password === "") {
            payload.password = null;
          }
          if (data.password_confirmation === "") {
            payload.password_confirmation = null;
          }
          editAccount.mutate(payload);
        })}
        className=" flex flex-col h-full w-full"
      >
        <div className="flex flex-col space-y-1.5 w-full">
          <div className="block">
            <h1 className="text-primary text-sm poppins-semibold">
              Select Account Role
            </h1>
            {errors.role ? (
              <span className="text-red-500 text-[0.7rem]">
                {errors.role.message}
              </span>
            ) : (
              <span className="text-slate-400 text-[0.7rem]">
                {user?.id == id
                  ? "You can't change your own role"
                  : "Select only one"}{" "}
                <span className="text-red-500">*</span>
              </span>
            )}
          </div>
          <div className="pb-1 thin-scrollbar w-full">
            {accountDetails.isLoading ? (
              <BoxesLoading totalBoxes={3} />
            ) : (
              <div className="flex gap-1.5 overflow-x-auto items-center w-full">
                {["cashier", "admin", "manager"].map((name, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (user?.id != id) {
                        setValue(
                          "role",
                          name as "cashier" | "admin" | "manager"
                        );
                      }
                      return;
                    }}
                    disabled={user?.id === id}
                    type="button"
                    className={` custom-border rounded-md p-3  min-h-10 flex items-center justify-center basis-[20%] flex-shrink-0 text-sm relative disabled:bg-secondary cursor-pointer ${
                      watch("role") === name
                        ? "border-primary text-primary bg-primary/15"
                        : "text-secondary/75"
                    }`}
                  >
                    {capitalizeFirstLetter(name)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="w-full h-[1px] bg-zinc-800/25 my-4"></span>
        <div className="flex flex-grow justify-center flex-col gap-2 w-full">
          <h1 className="text-primary text-sm poppins-semibold">
            Account Details
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 py-2 flex-grow h-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-center pr-2 overflow-y-auto">
              <div className="col-span-full">
                <InputBox
                  register={register}
                  tabIndex={1}
                  id="employer_name"
                  name="employer_name"
                  label="Employee Name"
                  type="text"
                  placeholder="Enter Product Name"
                  disabled={accountDetails.isLoading || editAccount.isPending}
                  errorMessage={errors.employer_name?.message}
                  isRequired
                />
              </div>
              <div className="col-span-full">
                <InputBox
                  register={register}
                  tabIndex={2}
                  id="username"
                  name="username"
                  label="Account Username"
                  type="text"
                  placeholder="Enter Account Username"
                  disabled={accountDetails.isLoading || editAccount.isPending}
                  errorMessage={errors.username?.message}
                  isRequired
                />
              </div>
              <InputBox
                register={register}
                tabIndex={3}
                id="password"
                name="password"
                label="New Account Password"
                type="password"
                placeholder="Enter New Account Password"
                disabled={editAccount.isPending}
                errorMessage={errors.password?.message}
              />
              <InputBox
                register={register}
                tabIndex={4}
                id="password_confirmation"
                name="password_confirmation"
                label="Confirm New Password"
                type="password"
                placeholder="Enter Confirm Password"
                disabled={editAccount.isPending}
                errorMessage={errors.password_confirmation?.message}
              />
              <div className="col-span-full">
                <InputBox
                  register={register}
                  tabIndex={5}
                  id="passcode"
                  name="passcode"
                  label="Account Passcode"
                  type="password"
                  placeholder="Enter Account Passcode"
                  disabled={accountDetails.isLoading || editAccount.isPending}
                  errorMessage={errors.passcode?.message}
                  isRequired
                />
              </div>
              <Button
                type="submit"
                disabled={editAccount.isPending || accountDetails.isLoading}
                isLoading={editAccount.isPending}
                label="Register Account"
                labelWhileLoading="Registering..."
                spinnerClassName="border-white size-5 border-t-transparent"
                className="col-span-full text-[0.8rem]"
              />
            </div>
            <div className="flex flex-col justify-center w-full items-center h-full p-3">
              <input
                {...register("profile_picture")}
                onChange={handleUploadProductThumbnail}
                type="file"
                id="upload-thumbnail"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
              <PreviewAccountProfile
                previewProductThumbnail={previewProductThumbnail}
                onClick={() => {
                  setPreviewProductThumbnail(null);
                  setValue("profile_picture", null);
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditAccount;
