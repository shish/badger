import { Link } from "@tanstack/react-router";

export function TagList({ tags }: { tags: string[] }) {
    return tags.map((tag, i) => [
        i > 0 && ", ",
        <Link key={tag} to="/badges" search={{ search: tag }}>
            {tag}
        </Link>,
    ]);
}
