import Link from "next/link";

import Button from "@/components/button";
import Tooltip from '@/components/tooltip';

interface IEditIconButton {
    href: string;
}

interface IEditIconButtonTooltip extends IEditIconButton {
    toooltipTitle: string;
}

export function EditIconButton({ href }: IEditIconButton) {
    return (
        <Button customClass="p-1 rounded-md inline mr-1">
            <Link href={href}>
                <i className='bi bi-pencil'></i>
            </Link>
        </Button>
    )
}

export function EditIconButtonTooltip({ href, toooltipTitle }: IEditIconButtonTooltip) {
    return (
        <Tooltip content={toooltipTitle}>
            <EditIconButton href={href} />
        </Tooltip>
    )
}