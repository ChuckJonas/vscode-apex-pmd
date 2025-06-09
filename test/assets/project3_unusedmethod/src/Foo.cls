public class Foo {
    // this method is needed, otherwise the whole class is considered as unused, as it would contain
    // then only one unused method.
    private void other() {}

    public void unusedMethod() {
        other();
    }
}
