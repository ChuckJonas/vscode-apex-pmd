// Test apex that should return a single error
public class Test{
    public Test(){
        while(true){
            Account acc = [SELECT Id FROM Account];
        }
    }
}