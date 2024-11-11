import { useEffect, useState } from "react";
import Image from "next/image";
import Input from '@/components/input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Button from '@/components/button';
import Link from 'next/link';
import { changeInputValue, changeOtpInputValue, handleLogin, handleOtpLogin } from '@/redux/actions/auth-action';
import { convertDateTimeToSeconds, formatTime } from "@/utils/remainingTime";

export default function Login() {
    const dispatch = useDispatch();
    const [viewMoreCredential, setViewMoreCredential] = useState<boolean>(false);
    const { loginInput, isSubmitting, otpStatus, otpExpireTime, otpInput } = useSelector((state: RootState) => state.Auth);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [remainingTime, setRemainingTime] = useState<number>(0);

    const changeTextInput = (name: string, value: any) => {
        dispatch(changeInputValue(name, value));
    };

    const changeOtpTextInput = (name: string, value: any) => {
        dispatch(changeOtpInputValue(name, value));
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        dispatch(handleLogin(loginInput));

    }

    useEffect(() => {
        if (otpExpireTime) {
            const remainingSeconds = convertDateTimeToSeconds(otpExpireTime);
            setRemainingTime(remainingSeconds);
        }
    }, [otpExpireTime]);


    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prevTime: any) => prevTime - 1);
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [remainingTime]);


    const onOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(handleOtpLogin(loginInput, otpInput));
    }

    return (
        <section className="md:h-screen py-4 px-6 md:px-10 bg-white text-gray-900 flex items-center justify-center border-b border-gray-200 lg:mt-1.5">
            <div className="w-full max-w-md mx-auto">
                <div className="flex justify-center items-center mb-10">
                    <Image src={'/next.png'} alt={'Banner'} height={50} width={250} unoptimized />
                </div>
                <form method="post" autoComplete="off">
                    <div>
                        <div className="flex items-center mb-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                            <p className="text-center font-semibold mx-4 mb-0">
                                Login
                            </p>
                        </div>

                        <Input
                            label='Email'
                            placeholder='Email'
                            name="email"
                            type="email"
                            value={loginInput.email}
                            inputChange={changeTextInput}
                        />
                        <div className="relative">
                            <Input
                                label='Password'
                                placeholder='Password'
                                name="password"
                                value={loginInput.password}
                                type={showPassword ? "text" : "password"}
                                inputChange={changeTextInput}
                            />
                            <span className="absolute top-[50%] right-3 cursor-pointer text-xl" onClick={() => setShowPassword(!showPassword)}>
                                {
                                    showPassword ? <i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>
                                }
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="form-group form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                    id="exampleCheck2"
                                />
                                <label
                                    className="form-check-label inline-block text-gray-800"
                                    htmlFor="exampleCheck2"
                                >
                                    Remember me
                                </label>
                            </div>
                            <div>
                                <Link href="/forget-password" className="text-gray-800">
                                    Forgot password?
                                </Link>
                                <i
                                    className="bi bi-gear cursor-pointer ml-5"
                                    title="Click to view other login credentials"
                                    onClick={() => setViewMoreCredential(!viewMoreCredential)}
                                ></i>
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <Button
                                title="Login"
                                onClick={(e: React.FormEvent) => onSubmit(e)}
                                position="text-left"
                                loadingTitle="Logging"
                                loading={isSubmitting}
                            />
                        </div>
                    </div>

                    {
                        viewMoreCredential &&
                        <div className="flex flex-row justify-center items-center flex-wrap">
                            <div className="max-w-[250px] text-sm bg-slate-100 mt-3 p-3 mr-2">
                                <b>Superadmin</b><br />
                                -----------------<br />
                                admin@example.com<br />
                                12345678
                            </div>
                        </div>
                    }
                </form>
            </div>
        </section>

    )
}
