class Service {
  final String description;
  final String description2;
  final String materialDescription;
  final int equipmentType;
  final String equipmentDescription;

  Service(
      {this.description,
      this.description2,
      this.materialDescription,
      this.equipmentType,
      this.equipmentDescription});

  factory Service.fromJSON(Map<String, dynamic> json) {
    return Service(
        description: json['description'],
        description2: json['description2'],
        materialDescription: json['materialDescription'],
        equipmentType: json['equipmentType'],
        equipmentDescription: json['equipmentDescription']);
  }
}
