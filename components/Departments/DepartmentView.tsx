import Breadcrumbs from "./Breadcrumbs";
import Hero from "./Hero";
import KPICards from "./KPICards";
import Missions from "./Missions";
import ServicesGrid from "./ServicesGrid";
import DownloadsList from "./DownloadsList";
import FAQAccordion from "./FAQAccordion";
import ContactsCard from "./ContactsCard";
import HighlightsCard from "./HighlightsCard";
import { buildTrail, departments } from "./utils";
import { DeptKey } from "./types";

export default function DepartmentView({ dept }: { dept: DeptKey }) {
    const d = departments[dept];

    const trail = buildTrail(d.title, d.slug);

    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
            <Breadcrumbs trail={trail} />

            {/* HERO + KPI */}
            <section>
                <Hero
                    title={d.title}
                    subtitle={d.subtitle}
                    image={d.hero?.image}
                    badge={d.hero?.badge}
                    hasDownloads={!!d.downloads?.length}
                />
                <KPICards kpis={d.kpis} />
            </section>

            {/* CONTENT GRID */}
            <section className="grid gap-6 md:grid-cols-3">
                {/* LEFT */}
                <div className="md:col-span-2 space-y-6">
                    <Missions items={d.missions} />
                    <ServicesGrid services={d.services} />
                    <DownloadsList files={d.downloads} />
                    <FAQAccordion faqs={d.faqs} />
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                    <ContactsCard contacts={d.contacts} />
                    <HighlightsCard items={d.highlights} />
                </div>
            </section>
        </div>
    );
}
