// Test apex that should return a single error
/**
 * @description Test class used to validate PMD rule output.
 */
public with sharing class Test{
    /**
     * @description Constructor that performs a SOQL query inside a loop to trigger PMD violations.
     */
    public Test(){
        while(true){
            Account acc = [SELECT Id FROM Account WITH SYSTEM_MODE];
        }
    }
}