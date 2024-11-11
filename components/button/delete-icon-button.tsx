import Button from "@/components/button";
import Tooltip from '@/components/tooltip';

interface IDeleteIconButton {
    onClick: () => void;
}

interface IDeleteIconButtonTooltip extends IDeleteIconButton {
    toooltipTitle: string;
}

export function DeleteIconButton({ onClick }: IDeleteIconButton) {
    return (
        <Button
            variant='danger'
            customClass="p-1 rounded-md inline mr-1"
            onClick={onClick}
        >
            <i className='bi bi-trash'></i>
        </Button>
    )
}

export function DeleteIconButtonTooltip({ onClick, toooltipTitle }: IDeleteIconButtonTooltip) {
    return (
        <Tooltip content={toooltipTitle}>
            <DeleteIconButton onClick={onClick} />
        </Tooltip>
    )
}