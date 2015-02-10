describe("Javascript sandbox", function() {

    //beforeEach(angular.module('app'));

  it("just a sanbox to play with javascript", function() {
      var arr=new Array();
      arr.push(1);
      arr.push(2);
      arr.push(3);


      expect(arr.length).toBe(3);
      arr.splice(1,1);
      expect(arr.length).toBe(2);
      expect(arr[0]).toBe(1);
      expect(arr[1]).toBe(3);
  });
});
