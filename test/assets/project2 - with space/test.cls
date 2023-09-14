// test case for https://github.com/ChuckJonas/vscode-apex-pmd/issues/139

// Test apex that should return a single error
public class Test {
    public Test() {
        while (true) {
            Account acc = [SELECT Id FROM Account]; // expected violation from rule: Performance-OperationWithLimitsInLoop
        }
    }
}
