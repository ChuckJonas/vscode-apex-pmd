package org.example.pmd.apex;

import net.sourceforge.pmd.RuleContext;
import net.sourceforge.pmd.lang.ast.Node;
import net.sourceforge.pmd.lang.apex.rule.AbstractApexRule;

public class MyCustomRule extends AbstractApexRule {
    @Override
    public void apply(Node target, RuleContext ctx) {
        ctx.addViolationWithMessage(target, "Violation...");
    }
}
