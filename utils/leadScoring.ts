export function calculateLeadScore(lead: any): { score: number, reason: string } {
    let score = 0;
    const reasons: string[] = [];

    // Check required fields
    if (lead.email) {
        score += 20;
    } else {
        reasons.push("missing email");
    }

    if (lead.phone) {
        score += 20;
    } else {
        reasons.push("missing phone");
    }

    if (lead.company) {
        score += 20;
    } else {
        reasons.push("missing company");
    }

    // Source quality
    if (lead.source === 'LinkedIn' || lead.source === 'Website') {
        score += 10;
    } else {
        reasons.push("lower-quality source");
    }

    // Stage progression
    let stageScore = 0;
    switch (lead.status) {
        case 'New':
            stageScore = 0;
            break;
        case 'Contacted':
            stageScore = 5;
            break;
        case 'Qualified':
            stageScore = 10;
            break;
        case 'Proposal':
            stageScore = 15;
            break;
        case 'Negotiation':
            stageScore = 20;
            break;
        case 'Won':
            stageScore = 30;
            break;
        case 'Lost':
            stageScore = 0;
            break;
        default:
            stageScore = 0;
    }
    score += stageScore;

    if (['New', 'Lost'].includes(lead.status)) {
        reasons.push("early/lost stage");
    }

    let reasonStr = "";
    if (score === 100) {
        reasonStr = "Excellent lead profile and progression.";
    } else {
        reasonStr = `Score: ${score} - ` + (reasons.length > 0 ? "Points deducted for: " + reasons.join(", ") : "Good lead profile.");
    }

    return { score, reason: reasonStr };
}
