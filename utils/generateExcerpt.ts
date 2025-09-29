interface GenerateExcerptProps {
    content?: string;
    minLength?: number;
    maxLength?: number;
}

export function generateExcerpt({ content, minLength = 100, maxLength = 150 }: GenerateExcerptProps): string {
    if (!content) {
        return "";
    }

    if (content.length <= maxLength) {
        return content;
    }

    let excerpt = content.substring(0, maxLength);

    if (excerpt.charAt(excerpt.length - 1) !== ' ') {
        const lastSpaceIndex = excerpt.lastIndexOf(' ');

        if (lastSpaceIndex !== -1 && lastSpaceIndex >= minLength) {
            excerpt = excerpt.substring(0, lastSpaceIndex);
        }
    }

    return excerpt.trim() + "...";
}
