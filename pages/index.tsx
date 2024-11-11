import Image from "next/image";
import { Inter } from "next/font/google";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { getEmployeeChartAction } from "@/redux/actions/employee-action";
import OrgChart from "./chart/OrgChart";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "@/utils/currency";
import { useRouter } from "next/router";
import { getDashboardCountingAction } from "@/redux/actions/dashboard-action";
import Card from "@/components/card";
// import { ArrowRightIcon } from '@heroicons/react/solid';

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { dashboardCount, isLoading } = useSelector((state: RootState) => state.dashboard);

  const Card = ({ children }) => (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-500 hover:shadow-xl">
      {children}
    </div>
  );
  


  const debouncedDispatch = useCallback(
    debounce(() => {
      dispatch(getDashboardCountingAction());
    }, 500),
    []
  );

  useEffect(() => {
    debouncedDispatch();
    return debouncedDispatch.cancel;
  }, [debouncedDispatch]);

  return (
    <>
      <div className="mt-4 w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 p-6">
    <Link href={'/division'}>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl sm:text-3xl leading-none font-bold">
              {dashboardCount.total_division}
            </span>
            <h3 className="text-sm font-normal">TOTAL DIVISION</h3>
          </div>
          <i className="fas fa-building text-3xl ml-2"></i>
        </div>
      </Card>
    </Link>
    <Link href={'/sub-division'}>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl sm:text-3xl leading-none font-bold">
              {dashboardCount.total_sub_division}
            </span>
            <h3 className="text-sm font-normal">TOTAL SUB DIVISION</h3>
          </div>
          <i className="fas fa-building text-3xl ml-2"></i>
        </div>
      </Card>
    </Link>
    <Link href={'/department'}>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl sm:text-3xl leading-none font-bold">
              {dashboardCount.total_department}
            </span>
            <h3 className="text-sm font-normal">TOTAL DEPARTMENT</h3>
          </div>
          <i className="fas fa-sitemap text-3xl ml-2"></i>
        </div>
      </Card>
    </Link>
    <Link href={'/employee'}>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl sm:text-3xl leading-none font-bold">
              {dashboardCount.total_employee}
            </span>
            <h3 className="text-sm font-normal">TOTAL EMPLOYEE</h3>
          </div>
          <i className="fas fa-users text-3xl ml-2"></i>
        </div>
      </Card>
    </Link>
  </div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Organizational Chart</h1>
        <OrgChart />
      </div>

    </>
  );
}
