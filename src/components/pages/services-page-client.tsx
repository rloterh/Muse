"use client";

import { BarChart3, Code2, Layers, Palette, Smartphone, Video } from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";
import type { LucideIcon } from "lucide-react";
import type { Service } from "@/types";

interface ServicesPageClientProps {
  services: Service[];
}

const iconMap: Record<string, LucideIcon> = {
  "bar-chart-3": BarChart3,
  barchart3: BarChart3,
  "brand-strategy": BarChart3,
  palette: Palette,
  "visual-identity": Palette,
  layers: Layers,
  "digital-design": Layers,
  "code-2": Code2,
  code2: Code2,
  "web-development": Code2,
  video: Video,
  "motion-3d": Video,
  smartphone: Smartphone,
  "product-design": Smartphone,
};

const fallbackIcons: LucideIcon[] = [BarChart3, Palette, Layers, Code2, Video, Smartphone];

function resolveIcon(iconName: string | undefined, index: number) {
  if (!iconName) return fallbackIcons[index % fallbackIcons.length];
  const key = iconName.toLowerCase().replace(/\s+/g, "-");
  return iconMap[key] ?? fallbackIcons[index % fallbackIcons.length];
}

export function ServicesPageClient({ services }: ServicesPageClientProps) {
  return (
    <>
      <Navigation />

      <section className="px-8 pb-20 pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">Capabilities</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight lg:text-7xl">
              Everything you need,{" "}
              <span className="italic text-[var(--color-accent)]">nothing</span>{" "}
              you do not
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-text-muted)]">
              We offer a focused set of services, each executed with depth and precision.
              No fluff, no filler. Just the expertise that moves the needle.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 pb-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-0">
            {services.map((service, index) => {
              const Icon = resolveIcon(service.icon, index);

              return (
                <Reveal key={service._id} delay={index * 0.08}>
                  <div className="group border-b border-[var(--color-border)] py-12 transition-colors hover:border-[var(--color-accent)]/30">
                    <div className="flex items-start gap-8">
                      <span className="mt-1 font-display text-xs text-[var(--color-text-dim)] transition-colors group-hover:text-[var(--color-accent)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-6">
                          <div>
                            <h2 className="font-display text-3xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)] lg:text-4xl">
                              {service.title}
                            </h2>
                            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--color-text-muted)]">
                              {service.description}
                            </p>
                          </div>
                          <Icon className="mt-2 h-6 w-6 shrink-0 text-[var(--color-text-dim)] transition-colors group-hover:text-[var(--color-accent)]" />
                        </div>

                        {service.features && service.features.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-3">
                            {service.features.map((feature) => (
                              <span
                                key={feature}
                                className="border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-accent)]/20 group-hover:text-[var(--color-text)]"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-8 py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-text-dim)]">How we work</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">Our process</h2>
          </Reveal>

          <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {[
              { step: "01", title: "Discover", desc: "Deep research into your brand, audience, and competitive landscape." },
              { step: "02", title: "Define", desc: "Strategic framework and creative direction aligned with business goals." },
              { step: "03", title: "Design", desc: "Iterative design with continuous feedback and collaborative refinement." },
              { step: "04", title: "Deliver", desc: "Production-ready output with documentation and ongoing support." },
            ].map((phase) => (
              <StaggerItem key={phase.step}>
                <div className="border-t border-[var(--color-border)] pt-6">
                  <span className="font-display text-xs font-bold text-[var(--color-accent)]">{phase.step}</span>
                  <h3 className="mt-3 font-display text-xl font-bold">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{phase.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </>
  );
}
