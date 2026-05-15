public global class Example { // PMD: AvoidGlobalModifier

    public Boolean bar(String z) {
        String x = 'some string'; // PMD: UnusedLocalVariable

        String y = 'some other string'; // used in the next line
        return z.equals(y);
    }
}
