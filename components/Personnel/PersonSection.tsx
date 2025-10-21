import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import PersonClient from "./PersonClient";
import { cn } from "@/lib/utils";
import { mockPersonnel } from "./types";

export default async function PersonSection() {
    const data = mockPersonnel

    return (
        <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6", "max-w-screen-xl")}>
            <nav aria-label="Breadcrumb" className="mb-2">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">หน้าแรก</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>คณะผู้บริหาร</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </nav>
            <header className="mt-6 flex flex-col gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    คณะผู้บริหาร
                </h1>
                <p className="text-muted-foreground">
                    ทำความรู้จักทีมผู้บริหารสำนักสาธารณสุขและสิ่งแวดล้อม
                    พร้อมบทบาทหน้าที่และช่องทางติดต่อ
                </p>
            </header>
            <Separator className="my-6" />
            <PersonClient items={data} />
        </div>
    );
}
