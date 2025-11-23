import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useContext, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { Badge } from "../components/Badge";
import { BadgeGridItem } from "../components/BadgeGridItem";
import { Grid } from "../components/Grid";
import { Ruler } from "../components/Ruler";
import { BasketContext } from "../providers/basket";
import { PocketBaseContext } from "../providers/pocketbase";

export const Route = createFileRoute("/basket")({
    component: BasketComponent,
    loader: async ({ context }) => {
        const badgeList = await context.pb
            .collection("badges")
            .getFullList<BadgeData>(500, {
                filter: Object.keys(context.basket.badges)
                    .map((id) => `id="${id}"`)
                    .join(" || "),
            });

        return {
            badgeDB: Object.fromEntries(
                badgeList.map((item) => [item.id, item]),
            ),
        };
    },
});

function BasketComponent() {
    const { badgeDB } = Route.useLoaderData();
    const { badges } = useContext(BasketContext);
    const contentRef = useRef<HTMLDivElement>(null);
    const { user } = useContext(PocketBaseContext);
    const printScale = user?.settings?.printScale || 1.0;

    return (
        <div className="flex flex-col gap-2 p-2">
            <Controls pageRef={contentRef} />
            <br />
            {/* for editing */}
            <Grid>
                {Object.entries(badges)
                    .filter(([id, count]) => badgeDB.hasOwnProperty(id))
                    .map(([id, count]) => (
                        <BadgeGridItem key={id} data={badgeDB[id]} />
                    ))}
            </Grid>
            {/* for printing */}
            <div style={{ display: "none" }}>
                <div ref={contentRef}>
                    <Ruler scale={printScale} />
                    <Grid gap={"5mm"} scale={printScale}>
                        {Object.entries(badges)
                            .filter(([id, count]) => badgeDB.hasOwnProperty(id))
                            .map(([id, count]) =>
                                Array.from({ length: count }).map(
                                    (_, index) => (
                                        <Badge
                                            key={`${id}-${index}`}
                                            data={badgeDB[id]}
                                            scale={printScale}
                                        />
                                    ),
                                ),
                            )}
                    </Grid>
                </div>
            </div>
        </div>
    );
}

function Controls({
    pageRef,
}: {
    pageRef: React.RefObject<HTMLDivElement | null>;
}) {
    const reactToPrintFn = useReactToPrint({
        documentTitle: "Badges",
        contentRef: pageRef,
    });

    return (
        <div className="flex flex-row gap-2">
            <button className="act small" onClick={reactToPrintFn}>
                Print
            </button>
            <div className="flex-1" />
        </div>
    );
}
