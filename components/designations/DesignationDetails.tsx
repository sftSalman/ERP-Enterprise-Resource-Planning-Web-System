import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Loading from '@/components/loading';

export default function DesignationDetails() {
    const { designationDetails, isLoadingDetails } = useSelector((state: RootState) => state.designation);

    return (
        <div>
            {
                isLoadingDetails === true ?
                    <div className="text-center">
                        <Loading loadingTitle="Designation Details" />
                    </div> :
                    <div className="text-gray-900">
                        {
                            (typeof designationDetails !== "undefined" && designationDetails !== null) ? (
                                <div className="grid gap-2 grid-cols-2">
                                    <div className='flex justify-between'>
                                        <h6>Designation Name</h6>
                                        <h6>:</h6>
                                    </div>
                                    <h6>{designationDetails.name}</h6>
                                    <div className='flex justify-between'>
                                        <h6>Project Code</h6>
                                        <h6>:</h6>
                                    </div>
                                    <h6>{designationDetails.code}</h6>
                                </div>
                            ) : (
                                <div>Something Went wrong!</div>
                            )
                        }
                    </div>
            }
        </div>

    );
}
