class TaskSite {
  final String name;
  final String name2;
  final String address;
  final String address2;
  final String postCode;
  final String city;
  final String countryCode;
  final String areaCode;

  TaskSite(
      {this.name,
      this.name2,
      this.address,
      this.address2,
      this.postCode,
      this.city,
      this.countryCode,
      this.areaCode});

  factory TaskSite.fromJSON(Map<String, dynamic> json) {
    return TaskSite(
      name: json['name'],
      name2: json['name2'],
      address: json['address'],
      address2: json['address2'],
      postCode: json['postCode'],
      city: json['city'],
      countryCode: json['countryCode'],
      areaCode: json['areaCode'],
    );
  }
}
