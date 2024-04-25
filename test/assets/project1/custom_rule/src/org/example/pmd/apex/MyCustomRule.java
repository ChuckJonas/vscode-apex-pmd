package org.example.pmd.apex;

import net.sourceforge.pmd.lang.ast.Node;
import net.sourceforge.pmd.lang.apex.rule.AbstractApexRule;
import net.sourceforge.pmd.reporting.RuleContext;

public class MyCustomRule extends AbstractApexRule {
    @Override
    public void apply(Node target, RuleContext ctx) {
        ctx.addViolationWithMessage(target, "Violation...");
    }
}
